'use client'
import { useUser } from '@/context/UserContext';
import { AlertService } from '@/services/alertService';
import { insertExpense } from '@/controllers/expenses/expenseController';
import { insertRecipient } from '@/controllers/expenses/recipientController';
import { ICONS } from '@/assets/icons';
import { Form } from '@/components/containers/Form';
import { Modal } from '@/components/containers/Modal';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { CategorySection } from '@/presentation/expenses/CategorySection';

export function ExpenseModal({ 
    title,
    onClose,
    expense,
    setExpense,
    expensesRefresh,
    recipients,
    categories,
    tags
}) {
    
    const { obj: user } = useUser();

    async function handleNewExpense() {
        const message = await insertExpense({
            ...expense,
            idUser: user.id
        });
        if(message) {
            AlertService.error(message);
        } else {
            AlertService.fastSuccess();
            expensesRefresh();
            onClose();
        }
    }

    return (
        <Modal title={title}
            onClose={onClose}
        >
            <Form>
                <div className='flex gap-1 w-full'>
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
                        initialValue={expense.idRecipient}
                        setValue={e => setExpense({ ...expense, idRecipient: e })}
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
                <ActionsSection>
                    {/* delete caso existe um expense.id */}
                    {!expense.id && 
                        <DefaultBtn text='Criar gasto'
                            icon={ICONS.add}
                            width='135px'
                            onClick={handleNewExpense}
                        />
                    }
                </ActionsSection>
            </Form>
        </Modal>
    );
}