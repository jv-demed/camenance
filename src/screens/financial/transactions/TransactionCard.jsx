import { useEffect, useState } from 'react';
import { DateService } from '@/services/DateService';
import { MonetaryService } from '@/services/MonetaryService';
import { ICONS } from '@/assets/icons';
import { PAYMENT_TYPES_LABELS } from '@/enums/PaymentTypes';
import { INCOME_TYPES_LABELS } from '@/enums/IncomeTypes';
import { TagBox } from '@/components/elements/TagBox';
import { TransactionModal } from './TransactionModal';

export function TransactionCard({
    record,
    payees,
    sources,
    categories,
    tags,
    creditCards,
    user,
    refresh
}) {

    const origin = record._isIncome
        ? sources.list.find(s => s.id == record.sourceId)
        : payees.list.find(p => p.id == record.payeeId);

    const category = categories.list.find(c => c.id == record.categoryId);
    const recordTags = tags.list
        .filter(t => t.categoryId == category?.id)
        .filter(t => record.tagIds.includes(t.id));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(record);

    useEffect(() => setEditRecord(record), [record]);

    return (
        <div className='relative group'>
            <div className={`
                absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
            `} />
            <div onClick={() => setIsModalOpen(true)}
                className={`
                    relative overflow-hidden rounded-xl px-4 py-2 backdrop-blur-lg cursor-pointer
                    bg-white/10 border border-white/20 shadow-xs transition-all duration-300
                    hover:border-white/30 hover:scale-[1.02]
                `}
            >
                <div className='flex justify-between items-start gap-4 text-[16px]'>
                    <div className='flex-1 flex flex-col gap-1'>
                        <div className='flex items-center gap-2'>
                            <h3>{record.title}</h3>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className={record._isIncome ? 'text-green-500' : 'text-[tomato]'}>
                            {MonetaryService.floatToBr(record.amount)}
                        </span>
                    </div>
                </div>
                <div className={`
                    flex items-center justify-between gap-2
                    text-sm text-gray-500
                `}>
                    <span>
                        {DateService.sqlDateToBrDate(record.date)}
                        {record._isIncome
                            ? record.incomeType && ` - ${INCOME_TYPES_LABELS[record.incomeType]}`
                            : record.paymentType && ` - ${PAYMENT_TYPES_LABELS[record.paymentType]}`
                        }
                    </span>
                    <div className='flex items-center gap-0.5'>
                        <span>{origin?.name}</span>
                        <ICONS.local />
                    </div>
                </div>
                {category && <div className='flex items-center gap-1 mt-2'>
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
                </div>}
                <div className={
                    `absolute top-0 right-0 w-20 h-20
                    bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10
                `} />
            </div>
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={editRecord}
                setRecord={setEditRecord}
                expensesRefresh={record._isIncome ? undefined : refresh}
                incomesRefresh={record._isIncome ? refresh : undefined}
                payees={payees}
                sources={sources}
                categories={categories}
                tags={tags}
                creditCards={creditCards}
                user={user}
            />
        </div>
    );
};
