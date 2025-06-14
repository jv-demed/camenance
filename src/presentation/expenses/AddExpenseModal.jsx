'use client'
import { Modal } from '@/components/containers/Modal';
import { DateInput } from '@/components/inputs/DateInput';
import { useEffect, useState } from 'react';

export function AddExpenseModal({ onClose }) {

    const [newExpense, setNewExpense] = useState({
        date: '',
    });

    useEffect(() => {
        console.log(newExpense);
    }, [newExpense]);

    return (
        <Modal title='Novo Gasto'
            onClose={onClose}
        >
            <DateInput 
                value={newExpense.date}
                setValue={e => setNewExpense({ ...newExpense, date: e })}
            />
        </Modal>
    );
}