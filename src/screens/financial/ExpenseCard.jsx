import { useState } from 'react';
import { DateService } from '@/services/DateService';
import { MonetaryService } from '@/services/monetaryService';
import { ICONS } from '@/assets/icons';
import { TagBox } from '@/components/elements/TagBox';
import { ExpenseModal } from '@/presentation/expenses/ExpenseModal';

export function ExpenseCard({ 
    expense,
    payees,
    categories,
    tags,
    user
}) {

    const payee = payees.list.find(p => p.id == expense.payeeId);
    const category = categories.list.find(c => c.id == expense.categoryId);
    const expenseTags = tags.list
        .filter(t => t.categoryId == category?.id)
        .filter(t => expense.tagIds.includes(t.id));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editExpense, setEditExpense] = useState(expense);

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
                <div className='flex justify-between gap-4 text-[16px]'>
                    <h3>{expense.title}</h3>
                    <span className={expense.isEntry ? 'text-green-500' : 'text-[tomato]'}>
                        {MonetaryService.floatToBr(expense.amount)}
                    </span>
                </div>
                <div className={`
                    flex items-center justify-between gap-2
                    text-sm text-gray-500    
                `}>
                    <span>
                        {DateService.timestamptzToStringWithMonth(expense.createdAt)}
                    </span>
                    <div className='flex items-center gap-0.5'>
                        <span>{payee.name}</span>
                        <ICONS.local />
                    </div>
                </div>
                {!expense.isEntry && <div className='flex items-center gap-1 mt-2'>
                    <TagBox 
                        tag={category}
                        fontSize='0.75rem'
                        paddingHorizontal='12px'
                        paddingVertical='4px'
                    />
                    <ul className='flex gap-1'>
                        {expenseTags.map(tag => (
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
            <ExpenseModal title={expense.title}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                expense={editExpense}
                setExpense={setEditExpense}
                payees={payees}
                categories={categories}
                tags={tags}
                user={user}
            />
        </div>
    );
};