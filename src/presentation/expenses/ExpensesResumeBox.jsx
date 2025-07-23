'use client'
import { ExpenseValueBox } from '@/presentation/expenses/ExpenseValueBox';

export function ExpensesResumeBox({
    expenses
}){

    const totalEntries = expenses
        .filter(entry => entry.isEntry)
        .reduce((prev, entry) => prev + entry.amount, 0);
    const totalExpenses = expenses
        .filter(expense => !expense.isEntry)
        .reduce((prev, expense) => prev + expense.amount, 0);
    const totalAmount = totalEntries - totalExpenses;

    return (
        <div className={`
            flex items-start gap-4
            w-full pr-2
        `}>
            <ExpenseValueBox 
                title='Entradas'
                value={+totalEntries}
                color='text-green-500'
            />
            <ExpenseValueBox 
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
            />
            <ExpenseValueBox 
                title='Saldo'
                value={totalAmount}
                color={totalAmount >= 0 ? 'text-green-500' : 'text-[tomato]'}
            />
        </div>
    )
}