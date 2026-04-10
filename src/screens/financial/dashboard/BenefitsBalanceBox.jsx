'use client'
import { useMemo } from 'react';
import { MonetaryService } from '@/services/MonetaryService';

function daysRemainingInMonth() {
    const today = new Date();
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    return lastDay - today.getDate() + 1;
}

export function BenefitsBalanceBox({ expenses, incomes, benefitTypes }) {

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
            const balance = totalIn - totalOut;
            return { id: bt.id, label: bt.title, color: bt.color ?? '#94a3b8', balance };
        });
    }, [expenses, incomes, benefitTypes?.list]);

    if (!benefits.length) return null;

    return (
        <div className='flex gap-4 w-full'>
            {benefits.map(b => (
                <div
                    key={b.id}
                    className='flex flex-col border border-border px-4 py-2 rounded-2xl flex-1'
                >
                    <div className='flex items-center gap-2'>
                        <span
                            className='w-2 h-2 rounded-full flex-shrink-0'
                            style={{ backgroundColor: b.color }}
                        />
                        <h3 className='text-sm'>{b.label}</h3>
                    </div>
                    <span className={b.balance >= 0 ? 'text-green-500' : 'text-[tomato]'}>
                        {MonetaryService.floatToBr(b.balance)}
                    </span>
                    {days > 0 && (
                        <span className='text-xs text-gray-400 mt-0.5'>
                            {MonetaryService.floatToBr(b.balance / days)} / dia
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}
