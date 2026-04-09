import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { creditCardRepository } from '@/repositories/CreditCardRepository';
import { installmentPurchaseRepository } from '@/repositories/InstallmentPurchaseRepository';
import { recurringTransactionRepository } from '@/repositories/RecurringTransactionRepository';
import { benefitTypeRepository } from '@/repositories/BenefitTypeRepository';
import { DATE_FILTER } from '@/enums/DateFilters';
import { FinancialService } from '@/services/FinancialService';
import { LocalStorageService } from '@/services/LocalStorageService';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { TransactionList } from '@/screens/financial/transactions/TransactionList';
import { FinancialFilters } from '@/screens/financial/dashboard/FinancialFilters';
import { FinancialSettingsModal } from '@/screens/financial/settings/FinancialSettingsModal';
import { FinancialDashboard } from '@/screens/financial/dashboard/FinancialDashboard';
import { CreditPurchasesList } from '@/screens/financial/credit/CreditPurchasesList';
import { RecurringTransactionsList } from '@/screens/financial/recurring/RecurringTransactionsList';
import { BoxesList } from '@/screens/financial/boxes/BoxesList';
import { IconBtn } from '@/components/buttons/IconBtn';
import { ICONS } from '@/assets/icons';

export function Financial() {

    const { user } = useUser();

    const expenses = useDataList({
        repository: expenseRepository,
        order: { column: 'date', ascending: false },
        filters: { userId: user.id }
    });

    const incomes = useDataList({
        repository: incomeRepository,
        order: { column: 'date', ascending: false },
        filters: { userId: user.id }
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

    const installmentPurchases = useDataList({
        repository: installmentPurchaseRepository,
        order: { column: 'start_date', ascending: false },
        filters: { userId: user.id }
    });

    const recurringTransactions = useDataList({
        repository: recurringTransactionRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id }
    });

    const benefitTypes = useDataList({
        repository: benefitTypeRepository,
        order: { column: 'title', ascending: true },
        filters: { userId: user.id }
    });

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        !expenses.loading &&
        !incomes.loading &&
        !payees.loading &&
        !sources.loading &&
        !categories.loading &&
        !tags.loading &&
        !creditCards.loading &&
        !installmentPurchases.loading &&
        !recurringTransactions.loading &&
        !benefitTypes.loading &&
        setIsLoading(false);
    }, [expenses, incomes, payees, sources, categories, tags, creditCards, installmentPurchases, recurringTransactions, benefitTypes]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');

    const [isRelative, setIsRelative] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_IS_RELATIVE, false)
    );
    const [dateFilter, setDateFilter] = useState(
        () => LocalStorageService.get(LocalStorageService.KEYS.FINANCIAL_DATE_FILTER, DATE_FILTER.MONTHLY)
    );

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

    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredIncomes, setFilteredIncomes] = useState([]);

    useEffect(() => {
        if(expenses) {
            const { list, startDate, endDate } = FinancialService.filterExpenses({
                expenses: expenses.list,
                isRelative: isRelative,
                dateFilter: dateFilter
            });
            setFilteredExpenses(list);
            setStartDate(startDate);
            setEndDate(endDate);
        }
    }, [expenses.list, dateFilter, isRelative]);

    useEffect(() => {
        if(incomes) {
            const { list } = FinancialService.filterExpenses({
                expenses: incomes.list,
                isRelative: isRelative,
                dateFilter: dateFilter
            });
            setFilteredIncomes(list);
        }
    }, [incomes.list, dateFilter, isRelative]);

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
                            startDate={startDate}
                            endDate={endDate}
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
                                {[
                                    { key: 'dashboard', label: 'Dashboard' },
                                    { key: 'credit', label: 'Crédito' },
                                    { key: 'recurring', label: 'Recorrentes' },
                                    { key: 'boxes', label: 'Caixinhas' },
                                ].map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
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
                            {activeTab === 'dashboard' && (
                                <FinancialDashboard
                                    expenses={filteredExpenses}
                                    incomes={filteredIncomes}
                                    categories={categories}
                                    payees={payees}
                                    sources={sources}
                                    benefitTypes={benefitTypes}
                                />
                            )}
                            {activeTab === 'credit' && (
                                <CreditPurchasesList
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
                            {activeTab === 'recurring' && (
                                <RecurringTransactionsList
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
                            expenses={filteredExpenses}
                            incomes={filteredIncomes}
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
