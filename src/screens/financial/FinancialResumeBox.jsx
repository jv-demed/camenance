import { FinancialValueBox } from '@/screens/financial/FinancialValueBox';

export function FinancialResumeBox({
    expenses
}){

    // const totalEntries = expenses
    //     .filter(entry => entry.isEntry)
    //     .reduce((prev, entry) => prev + entry.amount, 0);
    const totalExpenses = expenses
        .reduce((prev, expense) => prev + expense.amount, 0);
    // const totalAmount = totalEntries - totalExpenses;

    return (
        <div className={`
            flex items-start gap-4
            w-full pr-2
        `}>
            {/* <FinancialValueBox 
                title='Entradas'
                value={+totalEntries}
                color='text-green-500'
            /> */}
            <FinancialValueBox 
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
            />
            {/* <FinancialValueBox 
                title='Saldo'
                value={totalAmount}
                color={totalAmount >= 0 ? 'text-green-500' : 'text-[tomato]'}
            /> */}
        </div>
    )
}