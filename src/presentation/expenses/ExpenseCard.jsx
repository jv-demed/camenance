import { getBrValue } from '@/services/monetaryService';
import { dateToBrWithCompleteMonth } from '@/services/dateService';
import { TagBox } from '@/presentation/expenses/TagBox';

export function ExpenseCard({ 
    expense,
    place,
    category,
    tags
}) {
    return (
        <div className='relative group'>
            <div className={`
                absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300
            `} />
            <div className={`
                relative overflow-hidden rounded-xl px-4 py-2 backdrop-blur-lg 
                bg-white/10 border border-white/20 shadow-lg transition-all duration-300
                hover:shadow-xl hover:border-white/30 hover:scale-[1.02]
            `}>
                <div className='flex justify-between gap-4'>
                    <div className='flex flex-col'>
                        <span className='text-xl'>
                            {place.name}
                        </span>
                        <span className='text-sm text-gray-500'>
                            {dateToBrWithCompleteMonth(expense.date)}
                        </span>
                    </div>
                    <span className='text-xl'>
                        {getBrValue(expense.amount)}
                    </span>
                </div>
                <div className='flex items-center gap-1 mt-2'>
                    <TagBox 
                        tag={category}
                        fontSize='0.75rem'
                        paddingHorizontal='12px'
                        paddingVertical='4px'
                    />
                    <ul className='flex gap-1'>
                        {tags.map(tag => (
                            <li key={tag.id}
                                className='flex'
                            >
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
                <div className={
                    `absolute top-0 right-0 w-20 h-20 
                    bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10
                `} />
            </div>
        </div>
    );
};