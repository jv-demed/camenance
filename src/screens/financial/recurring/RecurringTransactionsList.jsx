import { useState, useMemo } from 'react';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { installmentPurchaseRepository } from '@/repositories/InstallmentPurchaseRepository';
import { recurringTransactionRepository } from '@/repositories/RecurringTransactionRepository';
import { ExpenseModel } from '@/models/ExpenseModel';
import { IncomeModel } from '@/models/IncomeModel';
import { InstallmentPurchaseModel } from '@/models/InstallmentPurchaseModel';
import { AlertService } from '@/services/AlertService';
import { DateService } from '@/services/DateService';
import { LocalStorageService } from '@/services/LocalStorageService';
import { RecurringService } from '@/services/RecurringService';
import { FINANCIAL_CATEGORY_TYPES } from '@/enums/FinancialCategoryTypes';
import { PAYMENT_TYPES } from '@/enums/PaymentTypes';
import { INCOME_TYPES } from '@/enums/IncomeTypes';
import { ICONS } from '@/assets/icons';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TextInput } from '@/components/inputs/TextInput';
import { RecurringTransactionCard } from './RecurringTransactionCard';
import { RecurringTransactionModal } from './RecurringTransactionModal';

const emptyRecord = {
    title: '',
    description: '',
    amount: 0,
    type: FINANCIAL_CATEGORY_TYPES.EXPENSE,
    paymentType: PAYMENT_TYPES.DEBIT,
    incomeType: INCOME_TYPES.PIX,
    payeeId: null,
    sourceId: null,
    categoryId: null,
    tagIds: [],
    creditCardId: null,
    frequency: 'monthly',
    startDate: DateService.dateToSqlDate(new Date()),
    dayOfWeek: 1,
    dayOfMonth: '1',
    realizedDates: [],
    skippedDates: [],
};

export function RecurringTransactionsList({
    recurringTransactions,
    payees,
    sources,
    categories,
    tags,
    creditCards,
    user,
    recurringRefresh,
    expensesRefresh,
    incomesRefresh,
    installmentPurchasesRefresh,
}) {
    const now = new Date();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [viewMode, setViewMode] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_RECURRING_VIEW, 'card')
    );
    const [loadingKey, setLoadingKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRecord, setModalRecord] = useState(emptyRecord);

    function handleViewModeChange(mode) {
        setViewMode(mode);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_RECURRING_VIEW, mode);
    }

    function openNew() {
        setModalRecord({ ...emptyRecord, startDate: DateService.dateToSqlDate(new Date()) });
        setIsModalOpen(true);
    }

    function openEdit(record) {
        setModalRecord(record);
        setIsModalOpen(true);
    }

    async function handleRealize(record, occurrenceDate) {
        const sqlDate = DateService.dateToSqlDate(occurrenceDate);
        setLoadingKey(`${record.id}-${sqlDate}`);
        try {
            const todaySqlDate = DateService.dateToSqlDate(new Date());
            if (record.type === FINANCIAL_CATEGORY_TYPES.INCOME) {
                await incomeRepository.insert(new IncomeModel({
                    title: record.title,
                    description: record.description || '',
                    amount: record.amount,
                    sourceId: record.sourceId,
                    incomeType: record.incomeType || INCOME_TYPES.PIX,
                    categoryId: record.categoryId,
                    tagIds: record.tagIds || [],
                    date: todaySqlDate,
                    userId: user.id,
                }));
                incomesRefresh?.();
            } else if (record.paymentType === PAYMENT_TYPES.CREDIT) {
                await installmentPurchaseRepository.insert(new InstallmentPurchaseModel({
                    title: record.title,
                    description: record.description || '',
                    totalAmount: record.amount,
                    installmentTotal: 1,
                    creditCardId: record.creditCardId || null,
                    payeeId: record.payeeId,
                    categoryId: record.categoryId,
                    tagIds: record.tagIds || [],
                    startDate: todaySqlDate,
                    userId: user.id,
                }));
                installmentPurchasesRefresh?.();
            } else {
                await expenseRepository.insert(new ExpenseModel({
                    title: record.title,
                    description: record.description || '',
                    amount: record.amount,
                    payeeId: record.payeeId,
                    paymentType: record.paymentType || PAYMENT_TYPES.DEBIT,
                    categoryId: record.categoryId,
                    tagIds: record.tagIds || [],
                    date: todaySqlDate,
                    userId: user.id,
                }));
                expensesRefresh?.();
            }
            await recurringTransactionRepository.update(record.id, {
                realizedDates: [...pruneOldDates(record.realizedDates), sqlDate],
            });
            recurringRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setLoadingKey(null);
        }
    }

    async function handleSkip(record, occurrenceDate) {
        const sqlDate = DateService.dateToSqlDate(occurrenceDate);
        setLoadingKey(`${record.id}-${sqlDate}`);
        try {
            await recurringTransactionRepository.update(record.id, {
                skippedDates: [...pruneOldDates(record.skippedDates), sqlDate],
            });
            recurringRefresh?.();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setLoadingKey(null);
        }
    }

    async function handleUnskip(record, occurrenceDate) {
        const sqlDate = DateService.dateToSqlDate(occurrenceDate);
        setLoadingKey(`${record.id}-${sqlDate}`);
        try {
            await recurringTransactionRepository.update(record.id, {
                skippedDates: pruneOldDates((record.skippedDates || []).filter(d => d !== sqlDate)),
            });
            recurringRefresh?.();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setLoadingKey(null);
        }
    }

    const firstFutureKey = useMemo(() => {
        const sections = buildSections(recurringTransactions.list, search, typeFilter);
        return sections.find(({ key }) => {
            const [y, m] = key.split('-').map(Number);
            return y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
        })?.key ?? null;
    }, [recurringTransactions.list, search, typeFilter]);

    function isBlocked(key) {
        if (key === firstFutureKey) return false;
        const [y, m] = key.split('-').map(Number);
        return y > now.getFullYear() || (y === now.getFullYear() && m > now.getMonth());
    }

    const sections = useMemo(
        () => buildSections(recurringTransactions.list, search, typeFilter),
        [recurringTransactions.list, search, typeFilter]
    );

    return (
        <>
            <div className='flex gap-1'>
                <TextInput placeholder='Buscar...' value={search} setValue={setSearch} />
                <DefaultBtn width='50px' icon={ICONS.add} onClick={openNew} />
            </div>
            <div className='flex items-center justify-between'>
                <div className='flex gap-1'>
                    {[
                        { key: 'all', label: 'Todos' },
                        { key: 'expense', label: 'Gastos' },
                        { key: 'income', label: 'Ganhos' },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setTypeFilter(f.key)}
                            className={`
                                px-3 py-1 rounded-lg text-xs transition-all duration-200
                                ${typeFilter === f.key
                                    ? 'bg-blue-500 text-white font-semibold'
                                    : 'text-gray-400 hover:text-blue-400'
                                }
                            `}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
                <div className='flex gap-1'>
                    {[
                        { key: 'card', Icon: ICONS.viewCard },
                        { key: 'list', Icon: ICONS.viewList },
                    ].map(({ key, Icon }) => (
                        <button
                            key={key}
                            onClick={() => handleViewModeChange(key)}
                            className={`
                                p-1 rounded-lg transition-all duration-200
                                ${viewMode === key
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-400 hover:text-blue-400'
                                }
                            `}
                        >
                            <Icon size={16} />
                        </button>
                    ))}
                </div>
            </div>
            <ul className={`
                flex flex-col gap-2 p-1.5
                overflow-x-hidden overflow-y-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:white
                [&::-webkit-scrollbar-track]:rounded-md
                [&::-webkit-scrollbar-thumb]:bg-gray-400/50
                [&::-webkit-scrollbar-thumb]:rounded-md
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/80
            `}>
                {sections.length === 0 ? (
                    <li className='flex flex-col items-center gap-2 py-8 text-gray-400'>
                        <ICONS.finances size={36} />
                        <span className='text-sm'>Nenhuma ocorrência recorrente</span>
                    </li>
                ) : sections.map(({ key, label, items }) => (
                    <li key={key} className='flex flex-col gap-2'>
                        <div className='px-1'>
                            <h4 className='text-xs font-semibold tracking-widest text-gray-400'>
                                {label}
                            </h4>
                        </div>
                        <ul className='flex flex-col gap-2'>
                            {items.map(({ record, date, sqlDate, status }) => (
                                <li key={`${record.id}-${sqlDate}`}>
                                    <RecurringTransactionCard
                                        record={record}
                                        occurrenceDate={date}
                                        status={status}
                                        payees={payees}
                                        sources={sources}
                                        categories={categories}
                                        tags={tags}
                                        onRealize={handleRealize}
                                        onSkip={handleSkip}
                                        onUnskip={handleUnskip}
                                        onEdit={openEdit}
                                        disabled={isBlocked(key)}
                                        loading={loadingKey === `${record.id}-${sqlDate}`}
                                        compact={viewMode === 'list'}
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <RecurringTransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={modalRecord}
                setRecord={setModalRecord}
                refresh={recurringRefresh}
                payees={payees}
                sources={sources}
                categories={categories}
                tags={tags}
                creditCards={creditCards}
                user={user}
            />
        </>
    );
}

function pruneOldDates(dates) {
    const now = new Date();
    const cutoff = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return (dates || []).filter(d => d.slice(0, 7) >= cutoff);
}

function buildSections(list, search, typeFilter) {
    const now = new Date();
    const occurrences = [];
    for (const record of list) {
        if (typeFilter === 'expense' && record.type !== FINANCIAL_CATEGORY_TYPES.EXPENSE) continue;
        if (typeFilter === 'income' && record.type !== FINANCIAL_CATEGORY_TYPES.INCOME) continue;
        if (search && !record.title.toLowerCase().includes(search.toLowerCase())) continue;
        const generated = RecurringService.generateOccurrences(record);
        for (const occ of generated) {
            if (occ.status === 'realized') continue;
            if (occ.status === 'skipped') {
                const isPastMonth = occ.date.getFullYear() < now.getFullYear() ||
                    (occ.date.getFullYear() === now.getFullYear() && occ.date.getMonth() < now.getMonth());
                if (isPastMonth) continue;
            }
            occurrences.push(occ);
        }
    }

    occurrences.sort((a, b) => a.date - b.date);

    const sections = [];
    for (const occ of occurrences) {
        const rawLabel = occ.date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
        const key = `${occ.date.getFullYear()}-${occ.date.getMonth()}`;
        let section = sections.find(s => s.key === key);
        if (!section) {
            section = { key, label, items: [] };
            sections.push(section);
        }
        section.items.push(occ);
    }

    return sections;
}
