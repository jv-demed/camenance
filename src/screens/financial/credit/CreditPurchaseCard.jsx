import { ICONS } from '@/assets/icons';
import { DateService } from '@/services/DateService';
import { MonetaryService } from '@/services/MonetaryService';
import { TagBox } from '@/components/elements/TagBox';

export function CreditPurchaseCard({
    purchase,
    installmentNumber,
    installmentAmount,
    dueDate,
    payees,
    categories,
    tags,
    onPay,
    onEdit,
    disabled = false,
    compact = false
}) {
    const payee = payees.list.find(p => p.id === purchase.payeeId);
    const category = categories.list.find(c => c.id === purchase.categoryId);
    const purchaseTags = tags.list
        .filter(t => t.categoryId == category?.id)
        .filter(t => purchase.tagIds?.includes(t.id));

    if (compact) return (
        <div
            onClick={() => onEdit(purchase)}
            className={`
                relative flex items-center gap-3 rounded-xl pl-3 pr-12 py-2 cursor-pointer
                bg-white/10 border border-white/20 backdrop-blur-lg
                transition-all duration-300 hover:border-white/30 hover:scale-[1.01]
            `}
        >
            <span className='flex-1 text-sm truncate'>{purchase.title}</span>
            {purchase.installmentTotal > 1 && (
                <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded shrink-0'>
                    {installmentNumber}/{purchase.installmentTotal}
                </span>
            )}
            <span className='text-xs text-gray-400 shrink-0'>
                {dueDate ? DateService.dateToBrDate(dueDate) : 'Sem venc.'}
            </span>
            <span className='text-sm text-[tomato] shrink-0'>
                {MonetaryService.floatToBr(installmentAmount)}
            </span>
            <button
                onClick={e => { e.stopPropagation(); onPay(purchase, installmentNumber, installmentAmount); }}
                disabled={disabled}
                title={disabled ? 'Parcela de mês futuro' : 'Marcar como pago'}
                className={`
                    absolute right-0 top-0 bottom-0 w-10
                    flex items-center justify-center
                    bg-blue-500/10 hover:bg-blue-500/25
                    border-l border-blue-500/20 hover:border-blue-500/40
                    text-blue-400 hover:text-blue-300
                    transition-all duration-200 cursor-pointer
                    rounded-r-xl
                    disabled:opacity-30 disabled:cursor-not-allowed
                `}
            >
                <ICONS.check size={12} />
            </button>
        </div>
    );

    return (
        <div className='relative group'>
            <div className={`
                absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
            `} />
            <div
                onClick={() => onEdit(purchase)}
                className={`
                    relative overflow-hidden rounded-xl pl-4 pr-16 py-2 backdrop-blur-lg cursor-pointer
                    bg-white/10 border border-white/20 shadow-xs transition-all duration-300
                    hover:border-white/30 hover:scale-[1.02]
                `}
            >
                <div className='flex justify-between items-start gap-4 text-[16px]'>
                    <div className='flex-1 flex items-center gap-2'>
                        <h3>{purchase.title}</h3>
                        {purchase.installmentTotal > 1 && (
                            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
                                {installmentNumber}/{purchase.installmentTotal}
                            </span>
                        )}
                    </div>
                    <span className='text-[tomato]'>
                        {MonetaryService.floatToBr(installmentAmount)}
                    </span>
                </div>
                <div className='flex items-center justify-between gap-2 text-sm text-gray-500'>
                    <span>
                        {dueDate
                            ? `Vence ${DateService.dateToBrDate(dueDate)}`
                            : 'Sem vencimento'
                        }
                    </span>
                    {payee && (
                        <div className='flex items-center gap-0.5'>
                            <span>{payee.name}</span>
                            <ICONS.local />
                        </div>
                    )}
                </div>
                <button
                    onClick={e => { e.stopPropagation(); onPay(purchase, installmentNumber, installmentAmount); }}
                    disabled={disabled}
                    title={disabled ? 'Parcela de mês futuro' : 'Marcar como pago'}
                    className={`
                        absolute right-0 top-0 bottom-0 w-12
                        flex items-center justify-center
                        bg-blue-500/10 hover:bg-blue-500/25
                        border-l border-blue-500/20 hover:border-blue-500/40
                        text-blue-400 hover:text-blue-300
                        transition-all duration-200 cursor-pointer
                        rounded-r-xl
                        disabled:opacity-30 disabled:cursor-not-allowed
                    `}
                >
                    <ICONS.check />
                </button>
                {category && (
                    <div className='flex items-center gap-1 mt-2'>
                        <TagBox
                            tag={category}
                            fontSize='0.75rem'
                            paddingHorizontal='12px'
                            paddingVertical='4px'
                        />
                        <ul className='flex gap-1'>
                            {purchaseTags.map(tag => (
                                <li key={tag.id} className='flex'>
                                    <TagBox
                                        tag={tag}
                                        fontSize='0.6rem'
                                        paddingHorizontal='8px'
                                        paddingVertical='2px'
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <div className='absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10' />
            </div>
        </div>
    );
}
