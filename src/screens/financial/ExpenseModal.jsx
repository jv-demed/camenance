'use client'
import { payeeRepository } from '@/repositories/PayeeRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { ICONS } from '@/assets/icons';
import { DateService } from '@/services/DateService';
import { AlertService } from '@/services/alertService';
import { PayeeModel } from '@/models/PayeeModel';
import { ExpenseModel } from '@/models/ExpenseModel';
import { Form } from '@/components/containers/Form';
import { Modal } from '@/components/containers/Modal';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { ExpenseCategorySection } from '@/screens/financial/ExpenseCategorySection';

export function ExpenseModal({
    isOpen,
    title,
    onClose,
    expense,
    expenseObj,
    setExpense,
    expensesRefresh,
    payees,
    categories,
    tags,
    user
}) {

    if(!isOpen) return null;

    async function handleAddPayee(newPayee) {
        const payee = new PayeeModel({
            ...newPayee,
            userId: user.id
        });
        const savedPayee = await payeeRepository.insert(payee);
        return savedPayee?.id;
    }

    async function handleNewExpense() {
        const model = new ExpenseModel({
            ...expense,
            userId: user.id,
            createdAt: DateService.dateToTimestamptz(expense.createdAt)
        });
        try {
            await expenseRepository.insert(model);
            AlertService.fastSuccess();
            expensesRefresh?.();
            onClose();
            setExpense?.(expenseObj);
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdateExpense() {
        const model = new ExpenseModel({
            ...expense,
            createdAt: DateService.dateToTimestamptz(expense.createdAt)
        });
        try {
            await expenseRepository.update(expense.id, model);
            AlertService.fastSuccess();
            expensesRefresh?.();
            onClose();
        } catch(e) {
            AlertService.error(e.message);
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
                        value={DateService.timestamptzToDate(expense.createdAt)}
                        setValue={e => setExpense({ ...expense, createdAt: e })}
                    />
                </div>
                <TextAreaInput placeholder='Descrição'
                    value={expense.description}
                    setValue={e => setExpense({ ...expense, description: e })}
                />
                <div className='flex gap-1'>
                    <AddInput placeholder='Beneficiário'
                        data={payees}
                        value={expense.payeeId}
                        setValue={e => setExpense({ ...expense, payeeId: e })}
                        onCreate={handleAddPayee}
                    />
                    <MoneyInput
                        value={expense.amount}
                        setValue={e => setExpense({ ...expense, amount: e })}
                    />
                </div>
                <ExpenseCategorySection
                    expense={expense}
                    setExpense={setExpense}
                    categories={categories}
                    tags={tags}
                />
                <ActionsSection>
                    {expense.id ? <DefaultBtn
                        text='Salvar'
                        icon={ICONS.check}
                        width='110px'
                        onClick={handleUpdateExpense}
                    /> 
                    : <DefaultBtn
                        text='Criar gasto'
                        icon={ICONS.add}
                        width='150px'
                        onClick={handleNewExpense}
                    />}
                </ActionsSection>
            </Form>
        </Modal>
    );
}
