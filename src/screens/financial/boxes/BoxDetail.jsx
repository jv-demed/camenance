import { useMemo } from 'react';
import { ICONS } from '@/assets/icons';
import { MonetaryService } from '@/services/MonetaryService';
import { ColorService } from '@/services/ColorService';
import { DateService } from '@/services/DateService';
import { BoxService } from '@/services/BoxService';
import { BoxModel } from '@/models/BoxModel';
import { BoxTransactionModel } from '@/models/BoxTransactionModel';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';

const TYPE_LABELS = {
    [BoxTransactionModel.TYPE.DEPOSIT]: 'Depósito',
    [BoxTransactionModel.TYPE.WITHDRAW]: 'Resgate',
    [BoxTransactionModel.TYPE.SPEND]: 'Gasto',
    [BoxTransactionModel.TYPE.YIELD]: 'Rendimento',
};

const TYPE_COLORS = {
    [BoxTransactionModel.TYPE.DEPOSIT]: 'text-blue-500',
    [BoxTransactionModel.TYPE.WITHDRAW]: 'text-orange-500',
    [BoxTransactionModel.TYPE.SPEND]: 'text-red-500',
    [BoxTransactionModel.TYPE.YIELD]: 'text-green-600',
};

export function BoxDetail({ box, transactions, onBack, onAction }) {
    const { gross, net, totalYield, provisionedIr } = useMemo(() => {
        const gross = BoxService.getGrossBalance(transactions);
        const net = BoxService.getNetBalance(transactions);
        const totalYield = transactions
            .filter(t => t.type === BoxTransactionModel.TYPE.YIELD)
            .reduce((s, t) => s + Number(t.amount), 0);
        return { gross, net, totalYield, provisionedIr: gross - net };
    }, [transactions]);

    const isNubank = box.type === BoxModel.TYPE.NUBANK;
    const color = box.color || '#7c3aed';
    const contrastColor = ColorService.getContrastColor(color);

    const sorted = useMemo(
        () => [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1)),
        [transactions]
    );

    return (
        <div className='flex flex-col gap-3 overflow-hidden'>

            {/* Header com a cor da caixinha */}
            <div
                className='flex items-center gap-3 px-4 py-3 rounded-xl'
                style={{ backgroundColor: color }}
            >
                <button
                    onClick={onBack}
                    className='opacity-80 hover:opacity-100 transition-opacity'
                    style={{ color: contrastColor }}
                >
                    <ICONS.arrowLeft size={20} />
                </button>
                <div className='flex flex-col min-w-0 flex-1'>
                    <h3 className='font-semibold truncate' style={{ color: contrastColor }}>
                        {box.name}
                    </h3>
                    {box.description && (
                        <span className='text-xs opacity-80 truncate' style={{ color: contrastColor }}>
                            {box.description}
                        </span>
                    )}
                </div>
                {isNubank && (
                    <span
                        className='text-xs px-2 py-0.5 rounded-full shrink-0'
                        style={{ backgroundColor: `${contrastColor}22`, color: contrastColor }}
                    >
                        {box.cdiPercentage}% CDI
                    </span>
                )}
            </div>

            {/* Resumo de saldo */}
            <div className='flex flex-col gap-1 p-4 rounded-xl bg-white/10 border border-white/20 backdrop-blur-lg'>
                <div className='flex items-baseline justify-between'>
                    <span className='text-xs text-gray-500'>Saldo líquido</span>
                    <span className='text-xl font-semibold text-gray-800'>{MonetaryService.floatToBr(net)}</span>
                </div>
                {isNubank && (
                    <>
                        <div className='flex items-baseline justify-between text-xs'>
                            <span className='text-gray-500'>Saldo bruto</span>
                            <span className='text-gray-700'>{MonetaryService.floatToBr(gross)}</span>
                        </div>
                        <div className='flex items-baseline justify-between text-xs'>
                            <span className='text-gray-500'>Rendimento acumulado</span>
                            <span className='text-green-600'>+ {MonetaryService.floatToBr(totalYield)}</span>
                        </div>
                        <div className='flex items-baseline justify-between text-xs'>
                            <span className='text-gray-500'>IOF/IR provisionado</span>
                            <span className='text-gray-600'>- {MonetaryService.floatToBr(provisionedIr)}</span>
                        </div>
                    </>
                )}
            </div>

            {/* Ações */}
            <div className='flex gap-2'>
                <DefaultBtn text='Depositar' icon={ICONS.add} onClick={() => onAction('deposit')} />
                <DefaultBtn text='Resgatar' icon={ICONS.arrowRight} onClick={() => onAction('withdraw')} />
                <DefaultBtn text='Gastar' icon={ICONS.check} onClick={() => onAction('spend')} />
            </div>

            {/* Histórico */}
            <ul className='
                flex flex-col gap-2 p-1.5
                overflow-x-hidden overflow-y-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-thumb]:bg-gray-400/50
                [&::-webkit-scrollbar-thumb]:rounded-md
            '>
                {sorted.length === 0 && (
                    <li className='text-center text-gray-400 text-sm py-4'>
                        Sem movimentações
                    </li>
                )}
                {sorted.map(tx => (
                    <li key={tx.id} className='
                        flex items-center justify-between
                        px-3 py-2 rounded-lg
                        bg-white/10 border border-white/20 backdrop-blur-lg
                    '>
                        <div className='flex flex-col'>
                            <span className={`text-xs font-medium ${TYPE_COLORS[tx.type]}`}>
                                {TYPE_LABELS[tx.type]}
                            </span>
                            <span className='text-sm text-gray-700'>
                                {tx.description || '—'}
                            </span>
                            <span className='text-xs text-gray-400'>
                                {DateService.sqlDateToBrDate(tx.date)}
                            </span>
                        </div>
                        <span className={`text-sm font-medium ${TYPE_COLORS[tx.type]}`}>
                            {MonetaryService.floatToBr(Number(tx.amount))}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
