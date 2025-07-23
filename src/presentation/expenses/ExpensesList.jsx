'use client'
import { useEffect, useState } from 'react';
import { DateService } from '@/services/dateService';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ExpenseCard } from '@/presentation/expenses/ExpenseCard';
import { ExpenseModal } from '@/presentation/expenses/ExpenseModal';

export function ExpensesList({
    expenses,
    origins,
    categories,
    tags,
    refresh
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
        date: DateService.dateToSupabase(new Date()),
        description: '',
        idCategory: null,
        idOrigin: null,
        idTags: [],
        idType: 0,
        isEntry: false,
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
                            place={origins.list.find(p => p.id == expense.idRecipient)}
                            origins={origins}
                            categories={categories}
                            tags={tags}
                        />
                    </li>
                ))}
            </ul>
            {isModalOpen && <ExpenseModal
                title={`Nova ${newExpense.isEntry ? 'entrada' : 'saída'}`}
                onClose={() => setIsModalOpen(false)}
                expense={newExpense}
                expenseObj={expenseObj}
                setExpense={setNewExpense}
                expensesRefresh={refresh}
                origins={origins}
                categories={categories}
                tags={tags}
            />}
        </div>
    );
}