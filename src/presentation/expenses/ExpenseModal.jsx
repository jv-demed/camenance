'use client'
import { useUser } from '@/context/UserContext';
import { AlertService } from '@/services/alertService';
import { insertOrigin } from '@/controllers/expenses/originController';
import { entryTypes, expensesTypes, insertExpense } from '@/controllers/expenses/expenseController';
import { ICONS } from '@/assets/icons';
import { Form } from '@/components/containers/Form';
import { Modal } from '@/components/containers/Modal';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { ExpenseCategorySection } from '@/presentation/expenses/ExpenseCategorySection';
import { DateService } from '@/services/DateService';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { PayeeModel } from '@/models/PayeeModel';

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
        const message = await insertExpense({
            ...expense,
            idUser: user.id,
            createdAt: DateService.dateToTimestamptz(expense.createdAt)
        });
        if(message) {
            AlertService.error(message);
        } else {
            AlertService.fastSuccess();
            expensesRefresh();
            onClose();
            setExpense(expenseObj);
        }
    }

    console.log(expense);

    return (
        <Modal title={title}
            onClose={onClose}
        >
            {/* <nav className='flex items-center justify-end gap-2 w-full'>
                <div className='flex gap-1'>
                    <span 
                        onClick={() => {
                            if(expense.isEntry) return;
                            setExpense({ ...expense, isEntry: true, idType: 0 })
                        }}
                        className={`
                            border border-border rounded-2xl
                            px-2 py-1 text-xs cursor-pointer
                            ${expense.isEntry && 'bg-primary text-white'}  
                        `}
                    >
                        Entrada
                    </span>
                    <span 
                        onClick={() => {
                            if(!expense.isEntry) return;
                            setExpense({ ...expense, isEntry: false, idType: 0 })
                        }}
                        className={`
                            border border-border rounded-2xl
                            px-2 py-1 text-xs cursor-pointer
                            ${!expense.isEntry && 'bg-primary text-white'}  
                        `}
                    >
                        Saída
                    </span>
                </div>
                <SelectMiniInput 
                    options={expense.isEntry ? entryTypes : expensesTypes}
                    value={expensesTypes[expense.idType]}
                    setValue={e => setExpense({ ...expense, idType: e.id })}
                />
            </nav> */}
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
                {/* <ExpenseCategorySection
                    expense={expense}
                    setExpense={setExpense}
                    categories={categories}
                    tags={tags}
                    isVisible={!expense.isEntry}
                /> */}
                <ActionsSection>
                    {/* delete caso existe um expense.id */}
                    {/* {!expense.id && 
                        <DefaultBtn 
                            text={`Criar ${expense.isEntry ? 'entrada' : 'saída'}`}
                            icon={ICONS.add}
                            width='150px'
                            onClick={handleNewExpense}
                        />
                    } */}
                </ActionsSection>
            </Form>
        </Modal>
    );
}