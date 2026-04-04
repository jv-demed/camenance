import { ICONS } from '@/assets/icons';
import { DateService } from '@/services/DateService';
import { MonetaryService } from '@/services/MonetaryService';
import { FINANCIAL_CATEGORY_TYPES } from '@/enums/FinancialCategoryTypes';
import { PAYMENT_TYPES_LABELS } from '@/enums/PaymentTypes';
import { INCOME_TYPES_LABELS } from '@/enums/IncomeTypes';
import { RECURRING_FREQUENCY_LABELS } from '@/enums/RecurringFrequency';
import { TagBox } from '@/components/elements/TagBox';

export function RecurringTransactionCard({
    record,
    occurrenceDate,
    status,
    payees,
    sources,
    categories,
    tags,
    onRealize,
    onSkip,
    onUnskip,
    onEdit,
    disabled = false,
    loading = false,
    compact = false
}) {
    const isIncome = record.type === FINANCIAL_CATEGORY_TYPES.INCOME;
    const isSkipped = status === 'skipped';
    const party = isIncome
        ? sources.list.find(s => s.id === record.sourceId)
        : payees.list.find(p => p.id === record.payeeId);
    const category = categories.list.find(c => c.id === record.categoryId);
    const recordTags = tags.list
        .filter(t => t.categoryId == category?.id)
        .filter(t => record.tagIds?.includes(t.id));

    const amountColor = isIncome ? 'text-emerald-400' : 'text-[tomato]';

    if (compact) return (
        <div
            onClick={() => !isSkipped && !loading && onEdit(record)}
            className={`
                relative flex items-center gap-3 rounded-xl pl-3 pr-24 py-2
                bg-white/10 border border-white/20 backdrop-blur-lg
                transition-all duration-300
                ${isSkipped || loading
                    ? 'opacity-40 cursor-default'
                    : 'cursor-pointer hover:border-white/30 hover:scale-[1.01]'
                }
            `}
        >
            {loading && (
                <div className='absolute inset-0 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 pointer-events-none'>
                    <ICONS.spinLoader size={16} className='animate-spin text-white' />
                </div>
            )}
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isIncome ? 'bg-emerald-400' : 'bg-[tomato]'}`} />
            <span className='flex-1 text-sm truncate'>{record.title}</span>
            <span className='text-xs text-gray-400 shrink-0'>
                {RECURRING_FREQUENCY_LABELS[record.frequency]}
                {' · '}
                {DateService.dateToBrDate(occurrenceDate)}
                {isIncome
                    ? record.incomeType && ` - ${INCOME_TYPES_LABELS[record.incomeType]}`
                    : record.paymentType && ` - ${PAYMENT_TYPES_LABELS[record.paymentType]}`
                }
            </span>
            <span className={`text-sm shrink-0 ${amountColor}`}>
                {MonetaryService.floatToBr(record.amount)}
            </span>
            <div onClick={e => e.stopPropagation()} className='absolute right-0 top-0 bottom-0 flex border-l border-white/10'>
                {isSkipped ? (
                    <button
                        onClick={() => onUnskip(record, occurrenceDate)}
                        title='Retomar ocorrência'
                        className={`
                            w-20 flex items-center justify-center
                            bg-yellow-500/10 hover:bg-yellow-500/25
                            text-yellow-400 hover:text-yellow-300
                            rounded-r-xl transition-all duration-200 cursor-pointer
                        `}
                    >
                        <ICONS.undo size={12} />
                    </button>
                ) : (<>
                    <button
                        onClick={() => onRealize(record, occurrenceDate)}
                        disabled={disabled}
                        title={disabled ? 'Ocorrência futura' : 'Lançar transação'}
                        className={`
                            w-10 flex items-center justify-center
                            bg-blue-500/10 hover:bg-blue-500/25
                            text-blue-400 hover:text-blue-300
                            transition-all duration-200 cursor-pointer
                            disabled:opacity-30 disabled:cursor-not-allowed
                        `}
                    >
                        <ICONS.check size={12} />
                    </button>
                    <button
                        onClick={() => onSkip(record, occurrenceDate)}
                        disabled={disabled}
                        title='Pular esta ocorrência'
                        className={`
                            w-10 flex items-center justify-center
                            bg-red-500/10 hover:bg-red-500/25
                            border-l border-red-500/20
                            text-red-400 hover:text-red-300
                            rounded-r-xl transition-all duration-200 cursor-pointer
                            disabled:opacity-30 disabled:cursor-not-allowed
                        `}
                    >
                        <ICONS.close size={12} />
                    </button>
                </>)}
            </div>
        </div>
    );

    return (
        <div className='relative group'>
            <div className={`
                absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
                pointer-events-none
            `} />
            <div
                onClick={() => !isSkipped && !loading && onEdit(record)}
                className={`
                    relative overflow-hidden rounded-xl pl-4 pr-16 py-2 backdrop-blur-lg
                    bg-white/10 border border-white/20 shadow-xs transition-all duration-300
                    ${isSkipped || loading
                        ? 'opacity-40 cursor-default'
                        : 'cursor-pointer hover:border-white/30 hover:scale-[1.02]'
                    }
                `}
            >
                {loading && (
                    <div className='absolute inset-0 rounded-xl flex items-center justify-center bg-black/20 backdrop-blur-sm z-10 pointer-events-none'>
                        <ICONS.spinLoader size={18} className='animate-spin text-white' />
                    </div>
                )}
                <div className='flex justify-between items-start gap-4 text-[16px]'>
                    <div className='flex-1 flex items-center gap-2'>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${isIncome ? 'bg-emerald-400' : 'bg-[tomato]'}`} />
                        <h3>{record.title}</h3>
                    </div>
                    <span className={amountColor}>
                        {MonetaryService.floatToBr(record.amount)}
                    </span>
                </div>
                <div className='flex items-center justify-between gap-2 text-sm text-gray-500'>
                    <span>
                        {RECURRING_FREQUENCY_LABELS[record.frequency]}
                        {' · '}
                        {DateService.dateToBrDate(occurrenceDate)}
                        {isIncome
                            ? record.incomeType && ` - ${INCOME_TYPES_LABELS[record.incomeType]}`
                            : record.paymentType && ` - ${PAYMENT_TYPES_LABELS[record.paymentType]}`
                        }
                    </span>
                    {party && (
                        <div className='flex items-center gap-0.5'>
                            <span>{party.name}</span>
                            {!isIncome && <ICONS.local />}
                        </div>
                    )}
                </div>
                <div onClick={e => e.stopPropagation()} className='absolute right-0 top-0 bottom-0 flex flex-col border-l border-white/10'>
                    {isSkipped ? (
                        <button
                            onClick={e => { e.stopPropagation(); onUnskip(record, occurrenceDate); }}
                            title='Retomar ocorrência'
                            className={`
                                flex-1 w-12 flex items-center justify-center
                                bg-yellow-500/10 hover:bg-yellow-500/25
                                text-yellow-400 hover:text-yellow-300
                                rounded-r-xl transition-all duration-200 cursor-pointer
                            `}
                        >
                            <ICONS.undo size={14} />
                        </button>
                    ) : (<>
                        <button
                            onClick={e => { e.stopPropagation(); onRealize(record, occurrenceDate); }}
                            disabled={disabled}
                            title={disabled ? 'Ocorrência futura' : 'Lançar transação'}
                            className={`
                                flex-1 w-12 flex items-center justify-center
                                bg-blue-500/10 hover:bg-blue-500/25
                                text-blue-400 hover:text-blue-300
                                rounded-tr-xl transition-all duration-200 cursor-pointer
                                disabled:opacity-30 disabled:cursor-not-allowed
                            `}
                        >
                            <ICONS.check size={14} />
                        </button>
                        <button
                            onClick={e => { e.stopPropagation(); onSkip(record, occurrenceDate); }}
                            disabled={disabled}
                            title='Pular esta ocorrência'
                            className={`
                                flex-1 w-12 flex items-center justify-center
                                bg-red-500/10 hover:bg-red-500/25
                                border-t border-white/10
                                text-red-400 hover:text-red-300
                                rounded-br-xl transition-all duration-200 cursor-pointer
                                disabled:opacity-30 disabled:cursor-not-allowed
                            `}
                        >
                            <ICONS.close size={14} />
                        </button>
                    </>)}
                </div>
                {category && (
                    <div className='flex items-center gap-1 mt-2'>
                        <TagBox
                            tag={category}
                            fontSize='0.75rem'
                            paddingHorizontal='12px'
                            paddingVertical='4px'
                        />
                        <ul className='flex gap-1'>
                            {recordTags.map(tag => (
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
                <div className='absolute top-0 right-12 w-20 h-20 bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none' />
            </div>
        </div>
    );
}
