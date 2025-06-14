'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { Main } from '@/components/containers/Main';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { ExpensesList } from '@/presentation/expenses/ExpensesList';

export default function Home() {  

    const { obj: user } = useUser();

    const expenses = useDataList({
        table: 'camenance-expenses',
        order: 'date',
        filter: q => q.eq('idUser', user.id)
    });
    
    const places = useDataList({
        table: 'camenance-expensesPlaces',
        filter: q => q.eq('idUser', user.id)
    });
    
    const categories = useDataList({
        table: 'camenance-expensesCategories',
        filter: q => q.eq('idUser', user.id)
    });
    
    const tags = useDataList({
        table: 'camenance-expensesTags',
        filter: q => q.eq('idUser', user.id)
    });
    
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        !expenses.loading && 
        !places.loading &&
        !categories.loading && 
        !tags.loading &&
        setIsLoading(false);
    }, [expenses, places, categories, tags]);

    return (
        <Main>
            {isLoading ? 
                <SpinLoader /> :
                <ExpensesList 
                    expenses={expenses}
                    places={places}
                    categories={categories}
                    tags={tags}
                />
            }
        </Main>
    );
}