import { useMemo } from 'react';
import { MonetaryService } from '@/services/MonetaryService';
import { ColorService } from '@/services/ColorService';
import { BoxModel } from '@/models/BoxModel';
import { BoxService } from '@/services/BoxService';
import { ICONS } from '@/assets/icons';

export function BoxCard({ box, transactions, onOpen, onEdit }) {
    const { gross, net, yieldMonth, lastDeposit } = useMemo(() => {
        const gross = BoxService.getGrossBalance(transactions);
        const net = BoxService.getNetBalance(transactions);
        const now = new Date();
        const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const yieldMonth = transactions
            .filter(t => t.type === 'yield' && t.date?.startsWith(monthPrefix))
            .reduce((s, t) => s + Number(t.amount), 0);
        const lastDeposit = transactions
            .filter(t => t.type === 'deposit')
            .sort((a, b) => (b.date > a.date ? 1 : -1))[0] ?? null;
        return { gross, net, yieldMonth, lastDeposit };
    }, [transactions]);

    const isNubank = box.type === BoxModel.TYPE.NUBANK;
    const color = box.color || '#7c3aed';
    const contrastColor = ColorService.getContrastColor(color);

    return (
        <div
            onClick={() => onOpen(box)}
            className='
                relative flex flex-col rounded-xl cursor-pointer overflow-hidden
                bg-white/10 border border-white/20 backdrop-blur-lg shadow-xs
                transition-all duration-300 hover:border-white/30 hover:scale-[1.01]
            '
        >
            {/* Banner colorido com nome */}
            <div
                className='flex items-center justify-between px-4 py-3'
                style={{ backgroundColor: color }}
            >
                <div className='flex flex-col min-w-0'>
                    <span
                        className='font-semibold truncate'
                        style={{ color: contrastColor }}
                    >
                        {box.name}
                    </span>
                    {box.description && (
                        <span
                            className='text-xs line-clamp-1 opacity-80'
                            style={{ color: contrastColor }}
                        >
                            {box.description}
                        </span>
                    )}
                </div>
                <button
                    type='button'
                    onClick={e => { e.stopPropagation(); onEdit(box); }}
                    className='shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity'
                    style={{ color: contrastColor }}
                >
                    <ICONS.edit size={14} />
                </button>
            </div>

            {/* Corpo */}
            <div className='flex flex-col gap-2 px-4 py-3'>
                <div className='flex flex-col'>
                    <span className='text-xs text-gray-500'>Saldo líquido</span>
                    <span className='text-xl font-semibold text-gray-800'>
                        {MonetaryService.floatToBr(net)}
                    </span>
                    {isNubank && Math.abs(gross - net) > 0.01 && (
                        <span className='text-xs text-gray-400'>
                            bruto {MonetaryService.floatToBr(gross)}
                        </span>
                    )}
                </div>

                {lastDeposit && (
                    <div className='text-xs text-gray-400'>
                        Último depósito: {MonetaryService.floatToBr(Number(lastDeposit.amount))} em{' '}
                        {new Date(lastDeposit.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </div>
                )}

                {isNubank && (
                    <div className='flex items-center justify-between'>
                        <span
                            className='text-xs px-2 py-0.5 rounded-full font-medium'
                            style={{
                                backgroundColor: `${color}22`,
                                color: color,
                            }}
                        >
                            {box.cdiPercentage}% CDI
                        </span>
                        {yieldMonth > 0 && (
                            <span className='text-xs text-green-600'>
                                + {MonetaryService.floatToBr(yieldMonth)} no mês
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
