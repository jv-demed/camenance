'use client'
import { MonetaryService } from '@/services/MonetaryService';
import { FinancialValueBox } from './FinancialValueBox';

function daysRemainingInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay - today.getDate() + 1; // inclui hoje
}

function perDay(value, days) {
    if (!days || days <= 0) return null;
    return `${MonetaryService.floatToBr(value / days)} / dia`;
}

export function FinancialResumeBox({ expenses, incomes }) {

    const mainExpenses = expenses.filter(e => !e.boxId && !e.benefitTypeId);
    const mainIncomes = incomes.filter(i => !i.benefitTypeId);
    const totalIncomes = mainIncomes.reduce((prev, income) => prev + income.amount, 0);
    const totalExpenses = mainExpenses.reduce((prev, expense) => prev + expense.amount, 0);
    const balance = totalIncomes - totalExpenses;

    const days = daysRemainingInMonth();

    return (
        <div className='flex items-start gap-4 w-full pr-2'>
            <FinancialValueBox
                title='Entradas'
                value={+totalIncomes}
                color='text-green-500'
                caption={perDay(totalIncomes, days)}
            />
            <FinancialValueBox
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
                caption={perDay(totalExpenses, days)}
            />
            <FinancialValueBox
                title='Saldo'
                value={balance}
                color={balance >= 0 ? 'text-green-500' : 'text-[tomato]'}
                caption={perDay(balance, days)}
            />
        </div>
    );
}
