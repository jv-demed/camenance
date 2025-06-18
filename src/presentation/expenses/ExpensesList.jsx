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
    recipients,
    categories,
    tags
}) {

    const [copyList, setCopyList] = useState(expenses.list);
    useEffect(() => {
        setCopyList(expenses.list);
    }, [expenses.list]);

    const [search, setSearch] = useState('');
    useEffect(() => {
        const filteredList = expenses.list.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase())
        );
        setCopyList(filteredList);
    }, [search, expenses.list]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newExpense, setNewExpense] = useState({
        title: '',
        description: '',
        date: DateService.dateToSupabase(new Date()),
        recipient: '',
        amount: 0,
        idCategory: '',
        idTags: []
    });

    return (
        <div className='space-y-4 w-[400px]'>
            <div className='flex gap-1'>
                <TextInput 
                    value={search}
                    setValue={setSearch}
                    placeholder='Buscar...'
                />
                <DefaultBtn 
                    width='50px'
                    icon={ICONS.add}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
            <ul className='flex flex-col gap-2'>
                {copyList.map(expense => (
                    <li key={expense.id}>
                        <ExpenseCard 
                            expense={expense} 
                            place={recipients.list.find(p => p.id == expense.idRecipient)}
                            categories={categories}
                            tags={tags}
                        />
                    </li>
                ))}
            </ul>
            {isModalOpen && <ExpenseModal
                title='Novo gasto'
                onClose={() => setIsModalOpen(false)}
                expense={newExpense}
                setExpense={setNewExpense}
                recipients={recipients}
                categories={categories}
                tags={tags}
            />}
        </div>
    );
}