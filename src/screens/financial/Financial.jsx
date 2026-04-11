import { useUser } from '@/contexts/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { useEffect, useMemo, useState } from 'react';
import { FinancialContext } from '@/contexts/FinancialContext';
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
    const [customDateRange, setCustomDateRange] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_CUSTOM_DATE_RANGE, { startDate: null, endDate: null })
    );

    const dateRange = useMemo(() => {
        if (dateFilter === DATE_FILTER.CUSTOM) {
            return {
                startDate: customDateRange.startDate ? new Date(customDateRange.startDate + 'T00:00:00') : null,
                endDate:   customDateRange.endDate   ? new Date(customDateRange.endDate   + 'T23:59:59.999') : null,
            };
        }
        return FinancialService.getDateRange({ dateFilter, isRelative });
    }, [dateFilter, isRelative, customDateRange]);

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

    function handleCustomDateRangeChange(range) {
        setCustomDateRange(range);
        LocalStorageService.set(LocalStorageService.KEYS.FINANCIAL_CUSTOM_DATE_RANGE, range);
    }

    const contextValue = {
        user,
        categories,
        tags,
        payees,
        sources,
        creditCards,
        benefitTypes,
        expenses: expenses.list,
        incomes: incomes.list,
        expensesRefresh: expenses.refresh,
        incomesRefresh: incomes.refresh,
        installmentPurchases,
        installmentPurchasesRefresh: installmentPurchases.refresh,
        recurringTransactions,
        recurringRefresh: recurringTransactions.refresh,
    };

    return (
        <FinancialContext.Provider value={contextValue}>
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
                                customDateRange={customDateRange}
                                setCustomDateRange={handleCustomDateRangeChange}
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
                                        <FinancialResumeBox />
                                        <FinancialDashboard />
                                    </div>
                                )}
                                {activeTab === 'credit' && (installmentPurchases.loading
                                    ? <SpinLoader />
                                    : <CreditPurchasesList />
                                )}
                                {activeTab === 'boxes' && <BoxesList />}
                                {activeTab === 'recurring' && (recurringTransactions.loading
                                    ? <SpinLoader />
                                    : <RecurringTransactionsList />
                                )}
                            </div>
                            <TransactionList />
                        </div>
                    </div>
                }
                <FinancialSettingsModal
                    isOpen={isSettingsOpen}
                    onClose={() => setIsSettingsOpen(false)}
                />
            </Main>
        </FinancialContext.Provider>
    );
}
