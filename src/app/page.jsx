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
        ascending: false,
        filter: q => q.eq('idUser', user.id)
    });
    
    const recipients = useDataList({
        table: 'camenance-expensesRecipients',
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
        !recipients.loading &&
        !categories.loading && 
        !tags.loading &&
        setIsLoading(false);
    }, [expenses, recipients, categories, tags]);

    return (
        <Main>
            {isLoading ? 
                <SpinLoader /> :
                <ExpensesList 
                    expenses={expenses}
                    recipients={recipients}
                    categories={categories}
                    tags={tags}
                />
            }
        </Main>
    );
}