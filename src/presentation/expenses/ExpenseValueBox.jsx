import { MonetaryService } from '@/services/monetaryService';

export function ExpenseValueBox({
    title,
    value,
    color
}) {
    return (
        <div className={`
            flex flex-col
            border border-border
            w-full px-4 py-2 rounded-2xl
        `}>
            <h3>{title}</h3>
            <span className={color}>
                {MonetaryService.floatToBr(value)}
            </span>
        </div>
    );
}