'use client'
import { useMemo } from 'react';
import { MonetaryService } from '@/services/MonetaryService';
import { FinancialValueBox } from './FinancialValueBox';
import { useFinancial } from '@/contexts/FinancialContext';

function daysRemainingInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay - today.getDate() + 1; // inclui hoje
}

function perDay(value, days) {
    if (!days || days <= 0) return null;
    return `${MonetaryService.floatToBr(value / days)} / dia`;
}

export function FinancialResumeBox() {
    const { expenses, incomes, benefitTypes } = useFinancial();

    const mainExpenses = expenses.filter(e => !e.boxId && !e.benefitTypeId);
    const mainIncomes = incomes.filter(i => !i.benefitTypeId);
    const totalIncomes = mainIncomes.reduce((prev, income) => prev + income.amount, 0);
    const totalExpenses = mainExpenses.reduce((prev, expense) => prev + expense.amount, 0);
    const balance = totalIncomes - totalExpenses;

    const days = daysRemainingInMonth();

    const benefits = useMemo(() => {
        const list = benefitTypes?.list ?? [];
        if (!list.length) return [];
        return list.map(bt => {
            const totalIn = incomes
                .filter(i => i.benefitTypeId === bt.id)
                .reduce((s, i) => s + i.amount, 0);
            const totalOut = expenses
                .filter(e => e.benefitTypeId === bt.id)
                .reduce((s, e) => s + e.amount, 0);
            return { id: bt.id, label: bt.title, color: bt.color ?? '#94a3b8', balance: totalIn - totalOut };
        });
    }, [expenses, incomes, benefitTypes?.list]);

    return (
        <div className='flex items-start gap-4 w-full pr-2'>
            <FinancialValueBox
                title='Entradas'
                value={+totalIncomes}
                color='text-green-500'
            />
            <FinancialValueBox
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
            />
            <FinancialValueBox
                title='Saldo'
                value={balance}
                color={balance >= 0 ? 'text-green-500' : 'text-[tomato]'}
                caption={perDay(balance, days)}
            />
            {benefits.length > 0 && (() => {
                const totalBenefits = benefits.reduce((s, b) => s + b.balance, 0);
                const tooltipItems = benefits.map(b => ({
                    label: b.label,
                    value: b.balance,
                    color: b.color,
                    valueColor: b.balance >= 0 ? 'text-green-500' : 'text-[tomato]',
                }));
                return (
                    <FinancialValueBox
                        title='Benefícios'
                        value={totalBenefits}
                        color={totalBenefits >= 0 ? 'text-green-500' : 'text-[tomato]'}
                        caption={perDay(totalBenefits, days)}
                        tooltipItems={tooltipItems}
                    />
                );
            })()}
        </div>
    );
}
