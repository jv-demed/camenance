'use client'
import { useEffect } from 'react';
import { Modal } from '@/components/containers/Modal';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { CategorySection } from './CategorySection';

export function ExpenseModal({ 
    title,
    onClose,
    expense,
    setExpense,
    categories
}) {

    useEffect(() => {
        console.log(expense);
    }, [expense]);

    return (
        <Modal 
            title={title}
            onClose={onClose}
        >
            <div className='flex flex-col gap-2'>
                <div className='flex gap-1'>
                    <TextInput placeholder='Título'
                        value={expense.title}
                        setValue={e => setExpense({ ...expense, title: e })}
                    />
                    <DateInput 
                        value={expense.date}
                        setValue={e => setExpense({ ...expense, date: e })}
                    />
                </div>
                <TextAreaInput placeholder='Descrição'
                    value={expense.description}
                    setValue={e => setExpense({ ...expense, description: e })}
                />
                <MoneyInput 
                    value={expense.amount}
                    setValue={e => setExpense({ ...expense, amount: e })}
                />
                <CategorySection
                    categories={categories}
                    value={expense.category}
                    setValue={e => setExpense({ ...expense, category: e })}
                />
            </div>
        </Modal>
    );
}