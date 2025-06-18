import { Modal } from '@/components/containers/Modal';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { CategorySection } from '@/presentation/expenses/CategorySection';
import { AddInput } from '@/components/inputs/AddInput';
import { insertRecipient } from '@/controllers/expenses/recipientController';
import { useUser } from '@/context/UserContext';

export function ExpenseModal({ 
    title,
    onClose,
    expense,
    setExpense,
    recipients,
    categories,
    tags
}) {
    console.log(expense);
    const { obj: user } = useUser();

    return (
        <Modal 
            title={title}
            onClose={onClose}
        >
            <div className='flex flex-col gap-2'>
                <div className='flex gap-1'>
                    <TextInput placeholder='Título'
                        value={expense.title}
                        setValue={e => setExpense({ ...expense, title: e })}
                    />
                    <DateInput 
                        value={expense.date}
                        setValue={e => setExpense({ ...expense, date: e })}
                    />
                </div>
                <TextAreaInput placeholder='Descrição'
                    value={expense.description}
                    setValue={e => setExpense({ ...expense, description: e })}
                />
                <div className='flex gap-1'>
                    <AddInput placeholder='Destinatário'
                        suggestions={recipients.list}
                        refresh={recipients.refresh}
                        onCreate={async newRecipient => await insertRecipient({
                            ...newRecipient,
                            idUser: user.id
                        })}
                    />
                    <MoneyInput 
                        value={expense.amount}
                        setValue={e => setExpense({ ...expense, amount: e })}
                    />
                </div>
                <CategorySection
                    expense={expense}
                    setExpense={setExpense}
                    categories={categories}
                    tags={tags}
                />
            </div>
        </Modal>
    );
}