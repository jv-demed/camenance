'use client'
import { useEffect, useState } from 'react';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ExpenseCard } from '@/presentation/expenses/ExpenseCard';
import { AddExpenseModal } from '@/presentation/expenses/AddExpenseModal';

export function ExpensesList({
    expenses,
    places,
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
            e.place.toLowerCase().includes(search.toLowerCase())
        );
        setCopyList(filteredList);
    }, [search, expenses.list]);

    const [isModalOpen, setIsModalOpen] = useState(false);

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
                {copyList.map((expense) => {
                    const category = categories.list.find(c => c.id == expense.category);
                    const expenseTags = tags.list
                        .filter(t => t.idCategory == category?.id)
                        .filter(t => expense.tags.includes(t.id));
                    return (
                        <li key={expense.id}>
                            <ExpenseCard 
                                expense={expense} 
                                place={places.list.find(p => p.id == expense.place)}
                                category={category}
                                tags={expenseTags}
                            />
                        </li>
                    )
                })}
            </ul>
            {isModalOpen && <AddExpenseModal
                onClose={() => setIsModalOpen(false)}
            />}
        </div>
    );
}