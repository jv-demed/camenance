'use client'
import { useMemo } from 'react';
import { FinancialValueBox } from './FinancialValueBox';

export function FinancialResumeBox({ expenses, incomes, benefitTypes }) {

    const totalIncomes = incomes.reduce((prev, income) => prev + income.amount, 0);
    const totalExpenses = expenses.reduce((prev, expense) => prev + expense.amount, 0);
    const balance = totalIncomes - totalExpenses;

    const benefitIncomes = useMemo(() => {
        const groups = {};
        incomes.filter(i => i.benefitTypeId).forEach(i => {
            groups[i.benefitTypeId] = (groups[i.benefitTypeId] || 0) + i.amount;
        });
        return Object.entries(groups).map(([id, value]) => {
            const bt = benefitTypes?.list?.find(b => b.id === id);
            return { label: bt?.title ?? 'Benefício', value, color: bt?.color ?? '#94a3b8' };
        });
    }, [incomes, benefitTypes?.list]);

    const benefitExpenses = useMemo(() => {
        const groups = {};
        expenses.filter(e => e.benefitTypeId).forEach(e => {
            groups[e.benefitTypeId] = (groups[e.benefitTypeId] || 0) + e.amount;
        });
        return Object.entries(groups).map(([id, value]) => {
            const bt = benefitTypes?.list?.find(b => b.id === id);
            return { label: bt?.title ?? 'Benefício', value, color: bt?.color ?? '#94a3b8' };
        });
    }, [expenses, benefitTypes?.list]);

    const benefitBalance = useMemo(() => {
        const allIds = new Set([
            ...incomes.filter(i => i.benefitTypeId).map(i => i.benefitTypeId),
            ...expenses.filter(e => e.benefitTypeId).map(e => e.benefitTypeId),
        ]);
        return [...allIds].map(id => {
            const totalIn = incomes.filter(i => i.benefitTypeId === id).reduce((s, i) => s + i.amount, 0);
            const totalOut = expenses.filter(e => e.benefitTypeId === id).reduce((s, e) => s + e.amount, 0);
            const value = totalIn - totalOut;
            const bt = benefitTypes?.list?.find(b => b.id === id);
            return {
                label: bt?.title ?? 'Benefício',
                value,
                color: bt?.color ?? '#94a3b8',
                valueColor: value >= 0 ? 'text-green-500' : 'text-[tomato]',
            };
        });
    }, [incomes, expenses, benefitTypes?.list]);

    return (
        <div className='flex items-start gap-4 w-full pr-2'>
            <FinancialValueBox
                title='Entradas'
                value={+totalIncomes}
                color='text-green-500'
                tooltipItems={benefitIncomes}
            />
            <FinancialValueBox
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
                tooltipItems={benefitExpenses}
            />
            <FinancialValueBox
                title='Saldo'
                value={balance}
                color={balance >= 0 ? 'text-green-500' : 'text-[tomato]'}
                tooltipItems={benefitBalance}
            />
        </div>
    );
}
