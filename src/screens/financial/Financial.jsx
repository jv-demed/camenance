import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { DATE_FILTER } from '@/enums/DateFilters';
import { FinancialService } from '@/services/FinancialService';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { TransactionList } from '@/screens/financial/TransactionList';
import { FinancialFilters } from '@/screens/financial/FinancialFilters';
import { FinancialResumeBox } from '@/screens/financial/FinancialResumeBox';
import { FinancialSettingsModal } from '@/screens/financial/FinancialSettingsModal';
import { FinancialDashboard } from '@/screens/financial/FinancialDashboard';
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

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        !expenses.loading &&
        !incomes.loading &&
        !payees.loading &&
        !sources.loading &&
        !categories.loading &&
        !tags.loading &&
        setIsLoading(false);
    }, [expenses, incomes, payees, sources, categories, tags]);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [isRelative, setIsRelative] = useState(false);
    const [dateFilter, setDateFilter] = useState(DATE_FILTER.MONTHLY);

    function handleDateFilterChange(filter) {
        setDateFilter(filter);
        setIsRelative(false);
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
                            setIsRelative={setIsRelative}
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
                            <FinancialResumeBox
                                expenses={filteredExpenses}
                                incomes={filteredIncomes}
                            />
                            <FinancialDashboard
                                expenses={filteredExpenses}
                                incomes={filteredIncomes}
                                categories={categories}
                                payees={payees}
                                sources={sources}
                                dateFilter={dateFilter}
                            />
                        </div>
                        <TransactionList
                            expenses={filteredExpenses}
                            incomes={filteredIncomes}
                            payees={payees}
                            sources={sources}
                            categories={categories}
                            tags={tags}
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
                user={user}
            />
        </Main>
    );
}
