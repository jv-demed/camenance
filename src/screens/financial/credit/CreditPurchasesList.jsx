import { useState, useMemo } from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { ExpenseModel } from '@/models/ExpenseModel';
import { CreditCardService } from '@/services/CreditCardService';
import { DateService } from '@/services/DateService';
import { AlertService } from '@/services/AlertService';
import { LocalStorageService } from '@/services/LocalStorageService';
import { PAYMENT_TYPES } from '@/enums/PaymentTypes';
import { ICONS } from '@/assets/icons';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TextInput } from '@/components/inputs/TextInput';
import { CreditPurchaseModal } from './CreditPurchaseModal';
import { CreditPurchaseCard } from './CreditPurchaseCard';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { MonetaryService } from '@/services/MonetaryService';

const emptyPurchase = {
    title: '',
    description: '',
    totalAmount: 0,
    installmentTotal: 1,
    creditCardId: null,
    payeeId: null,
    categoryId: null,
    tagIds: [],
    startDate: DateService.dateToSqlDate(new Date())
};

export function CreditPurchasesList() {
    const { expenses, payees, categories, tags, creditCards, user, installmentPurchases, installmentPurchasesRefresh, expensesRefresh } = useFinancial();

    const now = new Date();

    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');

    const installmentsByMonth = useMemo(() => {
        const result = [];
        for (const purchase of installmentPurchases.list) {
            if (typeFilter === 'installment' && purchase.installmentTotal <= 1) continue;
            if (typeFilter === 'single' && purchase.installmentTotal > 1) continue;
            const card = creditCards.list.find(c => c.id === purchase.creditCardId);
            const installmentAmount = purchase.totalAmount / purchase.installmentTotal;
            for (let i = 1; i <= purchase.installmentTotal; i++) {
                const isPaid = expenses.some(
                    e => e.installmentGroupId === purchase.id && e.installmentNumber === i
                );
                if (isPaid) continue;
                const dueDate = card
                    ? CreditCardService.calculateDueDate(card, purchase.startDate, i)
                    : null;
                result.push({ purchase, installmentNumber: i, installmentAmount, dueDate });
            }
        }
        result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate - b.dueDate;
        });

        const sections = [];
        for (const item of result) {
            const rawLabel = item.dueDate
                ? item.dueDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : 'sem vencimento';
            const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
            const key = item.dueDate
                ? `${item.dueDate.getFullYear()}-${item.dueDate.getMonth()}`
                : 'none';
            let section = sections.find(s => s.key === key);
            if (!section) {
                section = { key, label, items: [] };
                sections.push(section);
            }
            section.items.push(item);
        }
        if (!search) return sections;
        return sections
            .map(s => ({ ...s, items: s.items.filter(i => i.purchase.title.toLowerCase().includes(search.toLowerCase())) }))
            .filter(s => s.items.length > 0);
    }, [installmentPurchases.list, expenses, creditCards.list, search, typeFilter]);

    const firstFutureKey = installmentsByMonth.find(({ key }) => {
        if (key === 'none') return false;
        const [year, month] = key.split('-').map(Number);
        return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());
    })?.key ?? null;

    function isBlocked(key) {
        if (key === 'none' || key === firstFutureKey) return false;
        const [year, month] = key.split('-').map(Number);
        return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());
    }

    async function handlePayAll(key, items) {
        setPayingAllKey(key);
        try {
            await Promise.all(items.map(({ purchase, installmentNumber, installmentAmount }) =>
                expenseRepository.insert(new ExpenseModel({
                    title: `${purchase.title} ${installmentNumber}/${purchase.installmentTotal}`,
                    amount: installmentAmount,
                    date: DateService.dateToSqlDate(new Date()),
                    description: purchase.description || '',
                    payeeId: purchase.payeeId,
                    categoryId: purchase.categoryId,
                    tagIds: purchase.tagIds || [],
                    paymentType: PAYMENT_TYPES.CREDIT,
                    creditCardId: purchase.creditCardId,
                    installmentGroupId: purchase.id,
                    installmentNumber: installmentNumber,
                    installmentTotal: purchase.installmentTotal,
                    userId: user.id
                }))
            ));
            expensesRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setPayingAllKey(null);
        }
    }

    async function handlePay(purchase, installmentNumber, installmentAmount) {
        try {
            const model = new ExpenseModel({
                title: `${purchase.title} ${installmentNumber}/${purchase.installmentTotal}`,
                amount: installmentAmount,
                date: DateService.dateToSqlDate(new Date()),
                description: purchase.description || '',
                payeeId: purchase.payeeId,
                categoryId: purchase.categoryId,
                tagIds: purchase.tagIds || [],
                paymentType: PAYMENT_TYPES.CREDIT,
                creditCardId: purchase.creditCardId,
                installmentGroupId: purchase.id,
                installmentNumber: installmentNumber,
                installmentTotal: purchase.installmentTotal,
                userId: user.id
            });
            await expenseRepository.insert(model);
            expensesRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    const [viewMode, setViewMode] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_CREDIT_VIEW, 'card')
    );

    function handleViewModeChange(mode) {
        setViewMode(mode);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_CREDIT_VIEW, mode);
    }
    const [payingAllKey, setPayingAllKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRecord, setModalRecord] = useState(emptyPurchase);

    function openNew() {
        setModalRecord({
            ...emptyPurchase,
            startDate: DateService.dateToSqlDate(new Date()),
            creditCardId: creditCards.list[0]?.id ?? null
        });
        setIsModalOpen(true);
    }

    function openEdit(purchase) {
        setModalRecord(purchase);
        setIsModalOpen(true);
    }

    function getPaidCount(purchaseId) {
        return expenses.filter(e => e.installmentGroupId === purchaseId).length;
    }

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
                        { key: 'installment', label: 'Parcelado' },
                        { key: 'single', label: 'À vista' },
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
                {installmentsByMonth.length === 0 ? (
                    <li className='flex flex-col items-center gap-2 py-8 text-gray-400'>
                        <ICONS.finances size={36} />
                        <span className='text-sm'>Nenhuma compra no crédito</span>
                    </li>
                ) : installmentsByMonth.map(({ key, label, items }) => (
                    <li key={key} className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between px-1'>
                            <h4 className='text-xs font-semibold tracking-widest text-gray-400'>
                                {label}
                            </h4>
                            <div className='flex items-center gap-2'>
                                <span className='text-xs font-semibold text-gray-400'>
                                    {MonetaryService.floatToBr(items.reduce((sum, i) => sum + i.installmentAmount, 0))}
                                </span>
                            <button
                                onClick={() => handlePayAll(key, items)}
                                disabled={payingAllKey === key || isBlocked(key)}
                                title='Pagar todas as parcelas do mês'
                                className={`
                                    text-xs flex items-center gap-1 px-2 py-0.5 rounded
                                    bg-blue-500/10 hover:bg-blue-500/25
                                    border border-blue-500/20 hover:border-blue-500/40
                                    text-blue-400 hover:text-blue-300
                                    transition-all duration-200 cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {payingAllKey === key
                                    ? <SpinLoader color='text-blue-400' width='0.75rem' />
                                    : <><ICONS.check size={12} /> Pagar todos</>
                                }
                            </button>
                            </div>
                        </div>
                        <ul className='flex flex-col gap-2'>
                            {items.map(({ purchase, installmentNumber, installmentAmount, dueDate }) => (
                                <li key={`${purchase.id}-${installmentNumber}`}>
                                    <CreditPurchaseCard
                                        purchase={purchase}
                                        installmentNumber={installmentNumber}
                                        installmentAmount={installmentAmount}
                                        dueDate={dueDate}
                                        payees={payees}
                                        categories={categories}
                                        tags={tags}
                                        onPay={handlePay}
                                        onEdit={openEdit}
                                        disabled={isBlocked(key)}
                                        compact={viewMode === 'list'}
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
            <CreditPurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={modalRecord}
                setRecord={setModalRecord}
                refresh={installmentPurchasesRefresh}
                payees={payees}
                categories={categories}
                tags={tags}
                creditCards={creditCards}
                user={user}
                paidCount={modalRecord.id ? getPaidCount(modalRecord.id) : 0}
            />
        </>
    );
}
