import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { useEffect, useMemo, useState } from 'react';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { creditCardRepository } from '@/repositories/CreditCardRepository';
import { benefitTypeRepository } from '@/repositories/BenefitTypeRepository';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { installmentPurchaseRepository } from '@/repositories/InstallmentPurchaseRepository';
import { recurringTransactionRepository } from '@/repositories/RecurringTransactionRepository';
import { AlertService } from '@/services/AlertService';
import { FinancialService } from '@/services/FinancialService';
import { LocalStorageService } from '@/services/LocalStorageService';
import { ICONS } from '@/assets/icons';
import { DATE_FILTER } from '@/enums/DateFilters';
import { Main } from '@/components/containers/Main';
import { IconBtn } from '@/components/buttons/IconBtn';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { BoxesList } from '@/screens/financial/boxes/BoxesList';
import { FinancialFilters } from '@/screens/financial/dashboard/FinancialFilters';
import { TransactionList } from '@/screens/financial/transactions/TransactionList';
import { CreditPurchasesList } from '@/screens/financial/credit/CreditPurchasesList';
import { FinancialDashboard } from '@/screens/financial/dashboard/FinancialDashboard';
import { FinancialResumeBox } from '@/screens/financial/dashboard/FinancialResumeBox';
import { FinancialSettingsModal } from '@/screens/financial/settings/FinancialSettingsModal';
import { RecurringTransactionsList } from '@/screens/financial/recurring/RecurringTransactionsList';

const TABS = [
    { key: 'resumo', label: 'Dashboard' },
    { key: 'credit', label: 'Crédito' },
    { key: 'recurring', label: 'Recorrentes' },
    { key: 'boxes', label: 'Caixinhas' },
];

export function Financial() {

    const { user } = useUser();

    const [isRelative, setIsRelative] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_IS_RELATIVE, false)
    );
    const [dateFilter, setDateFilter] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_DATE_FILTER, DATE_FILTER.MONTHLY)
    );

    const dateRange = useMemo(
        () => FinancialService.getDateRange({ dateFilter, isRelative }),
        [dateFilter, isRelative]
    );

    const expenses = useDataList({
        repository: expenseRepository,
        order: { column: 'date', ascending: false },
        filters: { userId: user.id },
        dateRange
    });

    const incomes = useDataList({
        repository: incomeRepository,
        order: { column: 'date', ascending: false },
        filters: { userId: user.id },
        dateRange
    });

    const payees = useDataList({
        repository: payeeRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id }
    });

    const sources = useDataList({
        repository: sourceRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id }
    });

    const categories = useDataList({
        repository: financialCategoryRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id }
    });

    const tags = useDataList({
        repository: financialTagRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id }
    });

    const creditCards = useDataList({
        repository: creditCardRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id }
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('resumo');
    const [visitedTabs, setVisitedTabs] = useState(new Set(['resumo']));

    function handleTabChange(tab) {
        setActiveTab(tab);
        setVisitedTabs(prev => new Set([...prev, tab]));
    }

    const installmentPurchases = useDataList({
        repository: installmentPurchaseRepository,
        order: { column: 'start_date', ascending: false },
        filters: { userId: user.id },
        delay: !visitedTabs.has('credit')
    });

    const recurringTransactions = useDataList({
        repository: recurringTransactionRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id },
        delay: !visitedTabs.has('recurring')
    });

    const benefitTypes = useDataList({
        repository: benefitTypeRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id }
    });

    const isLoading = [expenses, incomes, payees, sources, categories, tags, creditCards, benefitTypes].some(h => h.loading);

    useEffect(() => {
        const allHooks = [expenses, incomes, payees, sources, categories, tags, creditCards, benefitTypes, installmentPurchases, recurringTransactions];
        const failed = allHooks.find(h => h.error);
        if (failed) AlertService.error('Erro ao carregar dados. Tente recarregar a página.');
    }, [
        expenses.error, incomes.error, payees.error, sources.error,
        categories.error, tags.error, creditCards.error, benefitTypes.error,
        installmentPurchases.error, recurringTransactions.error
    ]);

    function handleDateFilterChange(filter) {
        setDateFilter(filter);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_DATE_FILTER, filter);
        setIsRelative(false);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_IS_RELATIVE, false);
    }

    function handleIsRelativeChange(value) {
        setIsRelative(value);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_IS_RELATIVE, value);
    }

    return (
        <Main>
            {isLoading ? <SpinLoader /> :
                <div className={`
                    flex flex-col gap-2 w-full
                    h-screen max-h-screen overflow-hidden
                `}>
                    <PageHeader title='Financeiro'>
                        <FinancialFilters
                            dateFilter={dateFilter}
                            setDateFilter={handleDateFilterChange}
                            isRelative={isRelative}
                            setIsRelative={handleIsRelativeChange}
                            startDate={dateRange.startDate}
                            endDate={dateRange.endDate}
                        />
                        <IconBtn icon={ICONS.settings}
                            onClick={() => setIsSettingsOpen(true)}
                        />
                    </PageHeader>
                    <div className={`
                        flex gap-4 pt-1
                        overflow-hidden
                    `}>
                        <div className="flex flex-col gap-3 flex-1 min-w-0 overflow-hidden">
                            <div className="flex gap-1 border-b border-white/15 pb-1">
                                {TABS.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => handleTabChange(tab.key)}
                                        className={`
                                            px-4 py-1.5 rounded-lg text-sm transition-all duration-200
                                            ${activeTab === tab.key
                                                ? 'bg-white text-gray-500 font-semibold'
                                                : 'text-gray-400 hover:text-white'
                                            }
                                        `}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            {activeTab === 'resumo' && (
                                <div className='flex flex-col gap-4 overflow-y-auto pr-2 pb-4
                                    [&::-webkit-scrollbar]:w-1.5
                                    [&::-webkit-scrollbar-track]:rounded-md
                                    [&::-webkit-scrollbar-thumb]:bg-gray-400/50
                                    [&::-webkit-scrollbar-thumb]:rounded-md
                                    [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/80
                                '>
                                    <FinancialResumeBox
                                        expenses={expenses.list}
                                        incomes={incomes.list}
                                        benefitTypes={benefitTypes}
                                    />
                                    <FinancialDashboard
                                        expenses={expenses.list}
                                        incomes={incomes.list}
                                        categories={categories}
                                        payees={payees}
                                        sources={sources}
                                    />
                                </div>
                            )}
                            {activeTab === 'credit' && (installmentPurchases.loading
                                ? <SpinLoader />
                                : <CreditPurchasesList
                                    installmentPurchases={installmentPurchases}
                                    expenses={expenses.list}
                                    payees={payees}
                                    categories={categories}
                                    tags={tags}
                                    creditCards={creditCards}
                                    user={user}
                                    installmentPurchasesRefresh={installmentPurchases.refresh}
                                    expensesRefresh={expenses.refresh}
                                />
                            )}
                            {activeTab === 'boxes' && (
                                <BoxesList
                                    user={user}
                                    payees={payees}
                                    categories={categories}
                                    tags={tags}
                                    benefitTypes={benefitTypes}
                                    expensesRefresh={expenses.refresh}
                                    incomesRefresh={incomes.refresh}
                                />
                            )}
                            {activeTab === 'recurring' && (recurringTransactions.loading
                                ? <SpinLoader />
                                : <RecurringTransactionsList
                                    recurringTransactions={recurringTransactions}
                                    payees={payees}
                                    sources={sources}
                                    categories={categories}
                                    tags={tags}
                                    creditCards={creditCards}
                                    benefitTypes={benefitTypes}
                                    user={user}
                                    recurringRefresh={recurringTransactions.refresh}
                                    expensesRefresh={expenses.refresh}
                                    incomesRefresh={incomes.refresh}
                                    installmentPurchasesRefresh={installmentPurchases.refresh}
                                />
                            )}
                        </div>
                        <TransactionList
                            expenses={expenses.list}
                            incomes={incomes.list}
                            payees={payees}
                            sources={sources}
                            categories={categories}
                            tags={tags}
                            creditCards={creditCards}
                            benefitTypes={benefitTypes}
                            expensesRefresh={expenses.refresh}
                            incomesRefresh={incomes.refresh}
                            user={user}
                        />
                    </div>
                </div>
            }
            <FinancialSettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                categories={categories}
                tags={tags}
                payees={payees}
                sources={sources}
                creditCards={creditCards}
                benefitTypes={benefitTypes}
                user={user}
            />
        </Main>
    );
}
