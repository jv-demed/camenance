import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { expenseTagRepository } from '@/repositories/ExpenseTagRepository';
import { expenseCategoryRepository } from '@/repositories/ExpenseCategoryRepository';
import { DATE_FILTER } from '@/enums/DateFilters';
import { FinancialService } from '@/services/FinancialService';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { ExpenseList } from '@/screens/financial/ExpenseList';
import { FinancialFilters } from '@/screens/financial/FinancialFilters';
import { FinancialResumeBox } from '@/screens/financial/FinancialResumeBox';

export function Financial() {  

    const { user } = useUser();

    const expenses = useDataList({
        repository: expenseRepository,
        filters: { userId: user.id }
    });
    
    const payees = useDataList({
        repository: payeeRepository,
        order: 'name',
        filters: { userId: user.id }
    });

    const categories = useDataList({
        repository: expenseCategoryRepository,
        order: 'title',
        filters: { userId: user.id }
    });
    
    const tags = useDataList({
        repository: expenseTagRepository,
        order: 'title',
        filter: { userId: user.id }
    });
    
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        !expenses.loading && 
        !payees.loading &&
        !categories.loading && 
        !tags.loading &&
        setIsLoading(false);
    }, [expenses, payees, categories, tags ]);

    const [isRelative, setIsRelative] = useState(false);
    const [dateFilter, setDateFilter] = useState(DATE_FILTER.MONTHLY);

    function handleDateFilterChange(filter) {
        setDateFilter(filter);
        setIsRelative(false);
    }
    
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filteredExpenses, setFilteredExpenses] = useState([]);

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
                    </PageHeader>
                    <div className={`
                        flex gap-4 pt-1
                        overflow-hidden 
                    `}>
                        <FinancialResumeBox
                            expenses={filteredExpenses}
                        />
                        <ExpenseList 
                            expenses={filteredExpenses}
                            payees={payees}
                            categories={categories}
                            tags={tags}
                            refresh={expenses.refresh}
                            user={user}
                        />
                    </div>
                </div>
            }
        </Main>
    );
}