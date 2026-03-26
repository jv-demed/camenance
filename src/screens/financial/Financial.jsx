'use client'
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { dateFilters } from '@/controllers/expenses/financialController';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { expenseTagRepository } from '@/repositories/ExpenseTagRepository';
import { expenseCategoryRepository } from '@/repositories/ExpenseCategoryRepository';
import { DateService } from '@/services/DateService';
import { Main } from '@/components/containers/Main';
import { SwitchBtn } from '@/components/buttons/SwitchBtn';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { ExpenseList } from '@/screens/financial/ExpenseList';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';
import { ExpensesResumeBox } from '@/presentation/expenses/ExpensesResumeBox';
import { ICONS } from '@/assets/icons';
import { PageHeader } from '@/components/elements/PageHeader';
import { TableNames } from '@/assets/TableNames';
import { FinancialService } from '@/services/FinancialService';

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
    const [dateFilter, setDateFilter] = useState(dateFilters[2]);
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
                        {/*
                            <SelectMiniInput 
                                options={dateFilters}
                                value={dateFilter}
                                setValue={setDateFilter}
                            />
                            {dateFilter.id != 6 && <>
                                <div className='flex items-center gap-1 text-xs border border-border rounded-2xl p-2'>
                                    <span>
                                        {DateService.dateToDefaultBr(startDate)}
                                    </span>
                                    {dateFilter.id != 0 && <>
                                        <ICONS.chevronRight />
                                        <span>
                                            {DateService.dateToDefaultBr(endDate)}
                                        </span>
                                    </>}
                                </div>
                                {dateFilter.id != 0 && <div className='border border-border rounded-2xl p-1'>
                                    <SwitchBtn 
                                        onToggle={setIsRelative}
                                        labelLeft={() => <span className={`
                                            text-xs text-center w-12
                                        `}>
                                            Fixo
                                        </span>}
                                        labelRight={() => <span className={`
                                            text-xs text-center w-12
                                        `}>
                                            Relativo
                                        </span>}
                                        alwaysActivedColor
                                    />
                                </div>}
                            </>}
                        </div> */}
                    </PageHeader>
                    <div className={`
                        flex gap-4 pt-1
                        overflow-hidden 
                    `}>
                        {/* <ExpensesResumeBox 
                            expenses={filteredExpenses}
                        /> */}
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