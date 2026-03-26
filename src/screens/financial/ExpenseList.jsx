'use client'
import { useEffect, useState } from 'react';
import { DateService } from '@/services/DateService';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ExpenseCard } from '@/screens/financial/ExpenseCard';
import { ExpenseModal } from '@/screens/financial/ExpenseModal';

export function ExpenseList({
    expenses,
    payees,
    categories,
    tags,
    refresh,
    user
}) {

    const [copyList, setCopyList] = useState(expenses);
    useEffect(() => {
        setCopyList(expenses);
    }, [expenses]);

    const [search, setSearch] = useState('');
    useEffect(() => {
        const filteredList = expenses.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase())
        );
        setCopyList(filteredList);
    }, [search, expenses]);

    const expenseObj = {
        amount: 0,
        date: DateService.dateToSqlDate(new Date()),
        description: '',
        categoryId: null,
        tagIds: [],
        payeeId: null,
        title: ''
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState(expenseObj);

    return (
        <div className={`
            flex flex-col gap-2 
            w-[500px]
        `}>
            <div className='flex gap-1'>
                <TextInput 
                    placeholder='Buscar...'
                    value={search}
                    setValue={setSearch}
                />
                <DefaultBtn 
                    width='50px'
                    icon={ICONS.add}
                    onClick={() => setIsModalOpen(true)}
                />
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
            `}
            >
                {copyList.map(expense => (
                    <li key={expense.id}>
                        <ExpenseCard
                            expense={expense}
                            payees={payees}
                            categories={categories}
                            tags={tags}
                            user={user}
                            refresh={refresh}
                        />
                    </li>
                ))}
            </ul>
            <ExpenseModal
                isOpen={isModalOpen}
                title='Novo Gasto'
                onClose={() => { setIsModalOpen(false); setNewExpense(expenseObj); }}
                expense={newExpense}
                setExpense={setNewExpense}
                expensesRefresh={refresh}
                payees={payees}
                categories={categories}
                tags={tags}
                user={user}
            />
        </div>
    );
}