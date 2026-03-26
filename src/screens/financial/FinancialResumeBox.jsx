import { FinancialValueBox } from '@/screens/financial/FinancialValueBox';

export function FinancialResumeBox({
    expenses,
    incomes
}){

    const totalIncomes = incomes.reduce((prev, income) => prev + income.amount, 0);
    const totalExpenses = expenses.reduce((prev, expense) => prev + expense.amount, 0);
    const balance = totalIncomes - totalExpenses;

    return (
        <div className={`
            flex items-start gap-4
            w-full pr-2
        `}>
            <FinancialValueBox
                title='Entradas'
                value={+totalIncomes}
                color='text-green-500'
            />
            <FinancialValueBox
                title='Saídas'
                value={-totalExpenses}
                color='text-[tomato]'
            />
            <FinancialValueBox
                title='Saldo'
                value={balance}
                color={balance >= 0 ? 'text-green-500' : 'text-[tomato]'}
            />
        </div>
    )
}
