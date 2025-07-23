'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { dateFilters, filterExpenses } from '@/controllers/expenses/financialController';
import { DateService } from '@/services/dateService';
import { Main } from '@/components/containers/Main';
import { SwitchBtn } from '@/components/buttons/SwitchBtn';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { ExpensesList } from '@/presentation/expenses/ExpensesList';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';
import { ExpensesResumeBox } from '@/presentation/expenses/ExpensesResumeBox';
import { ICONS } from '@/assets/icons';

export default function Home() {  

    const { obj: user } = useUser();

    const expenses = useDataList({
        table: 'camenance-expenses',
        order: 'date',
        ascending: false,
        filter: q => q.eq('idUser', user.id)
    });
    
    const origins = useDataList({
        table: 'camenance-expensesOrigins',
        order: 'name',
        filter: q => q.eq('idUser', user.id)
    });
    
    const categories = useDataList({
        table: 'camenance-expensesCategories',
        order: 'name',
        filter: q => q.eq('idUser', user.id)
    });
    
    const tags = useDataList({
        table: 'camenance-expensesTags',
        order: 'name',
        filter: q => q.eq('idUser', user.id)
    });
    
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        !expenses.loading && 
        !origins.loading &&
        !categories.loading && 
        !tags.loading &&
        setIsLoading(false);
    }, [expenses, origins, categories, tags]);

    const [isRelative, setIsRelative] = useState(false);
    const [dateFilter, setDateFilter] = useState(dateFilters[2]);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [filteredExpenses, setFilteredExpenses] = useState([]);

    useEffect(() => {
        if(expenses) {
            const { list, startDate, endDate } = filterExpenses({
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
            {isLoading 
                ? <SpinLoader /> 
                : <div className={`
                    flex flex-col gap-2 w-full
                    h-screen max-h-screen overflow-hidden
                `}>
                    <header className={`
                        flex items-center justify-between
                        border-b border-border pb-1
                    `}>
                        <h1 className='text-xl'>
                            Financeiro
                        </h1>
                        <div className='flex items-center gap-2'>
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
                        </div>
                    </header>
                    <div className={`
                        flex gap-4 pt-1
                        overflow-hidden 
                    `}>
                        <ExpensesResumeBox 
                            expenses={filteredExpenses}
                        />
                        <ExpensesList 
                            expenses={filteredExpenses}
                            origins={origins}
                            categories={categories}
                            tags={tags}
                            refresh={expenses.refresh}
                        />
                    </div>
                </div>
            }
        </Main>
    );
}