'use client'
import { useState } from 'react';
import { MonetaryService } from '@/services/MonetaryService';

export function FinancialValueBox({ title, value, color, caption, accentColor, tooltipItems }) {

    const [hovered, setHovered] = useState(false);
    const hasTooltip = tooltipItems?.length > 0;

    return (
        <div
            className='relative flex flex-col border border-border w-full px-4 py-2 rounded-2xl'
            onMouseEnter={() => hasTooltip && setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <div className='flex items-center gap-2'>
                {accentColor && (
                    <span className='w-2 h-2 rounded-full flex-shrink-0' style={{ backgroundColor: accentColor }} />
                )}
                <h3>{title}</h3>
            </div>
            <span className={color}>
                {MonetaryService.floatToBr(value)}
            </span>
            {caption != null && (
                <span className='text-xs text-gray-400 mt-0.5'>{caption}</span>
            )}

            {hovered && hasTooltip && (
                <div className='absolute top-full left-0 mt-2 z-10 bg-white border border-border rounded-xl shadow-lg px-4 py-3 min-w-[180px] flex flex-col gap-2'>
                    <span className='text-xs font-semibold text-gray-400 uppercase tracking-wide'>Benefícios</span>
                    {tooltipItems.map((item, i) => (
                        <div key={i} className='flex items-center justify-between gap-4'>
                            <div className='flex items-center gap-2'>
                                <span
                                    className='w-2.5 h-2.5 rounded-full flex-shrink-0'
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className='text-sm text-gray-700'>{item.label}</span>
                            </div>
                            <span className={`text-sm font-medium ${item.valueColor ?? color}`}>
                                {MonetaryService.floatToBr(item.value)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
