'use client'
import { useState } from 'react';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/AlertService';
import { PayeeModel } from '@/models/PayeeModel';
import { SourceModel } from '@/models/SourceModel';
import { ExpenseModel } from '@/models/ExpenseModel';
import { IncomeModel } from '@/models/IncomeModel';
import { FINANCIAL_CATEGORY_TYPES, FINANCIAL_CATEGORY_TYPES_OPTIONS } from '@/enums/FinancialCategoryTypes';
import { PAYMENT_TYPES, PAYMENT_TYPES_OPTIONS } from '@/enums/PaymentTypes';
import { INCOME_TYPES, INCOME_TYPES_OPTIONS } from '@/enums/IncomeTypes';
import { Form } from '@/components/containers/Form';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SelectInput } from '@/components/inputs/SelectInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { TransactionCategorySection } from './TransactionCategorySection';

export function TransactionModal({
    isOpen,
    onClose,
    record,
    setRecord,
    expensesRefresh,
    incomesRefresh,
    payees,
    sources,
    categories,
    tags,
    benefitTypes,
    user
}) {

    if(!isOpen) return null;

    const [categoryType, setCategoryType] = useState(
        record._isIncome ? FINANCIAL_CATEGORY_TYPES.INCOME : FINANCIAL_CATEGORY_TYPES.EXPENSE
    );

    const isIncome = categoryType === FINANCIAL_CATEGORY_TYPES.INCOME;

    const isBenefitIncome = isIncome && (record.incomeType || INCOME_TYPES.PIX) === INCOME_TYPES.BENEFITS;
    const isBenefitExpense = !isIncome && (record.paymentType || PAYMENT_TYPES.DEBIT) === PAYMENT_TYPES.BENEFITS;
    const showBenefitSelector = isBenefitIncome || isBenefitExpense;

    const benefitTypeOptions = (benefitTypes?.list || []).map(b => ({ value: b.id, label: b.title }));



    async function handleAddPayee(newPayee) {
        const payee = new PayeeModel({ ...newPayee, userId: user.id });
        const saved = await payeeRepository.insert(payee);
        return saved?.id;
    }

    async function handleAddSource(newSource) {
        const source = new SourceModel({ ...newSource, userId: user.id });
        const saved = await sourceRepository.insert(source);
        return saved?.id;
    }

    async function handleInsert() {
        try {
            if(isIncome) {
                const model = new IncomeModel({ ...record, userId: user.id });
                await incomeRepository.insert(model);
                incomesRefresh?.();
            } else {
                // Lógica para despesas, incluindo crédito parcelado
                const model = new ExpenseModel({
                    ...record,
                    paymentType: record.paymentType || PAYMENT_TYPES.DEBIT,
                    userId: user.id
                });
                await expenseRepository.insert(model);
                expensesRefresh?.();
            }
            AlertService.fastSuccess();
            onClose();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete() {
        const confirmed = await AlertService.confirm('Esta ação não pode ser desfeita.');
        if (!confirmed) return;
        try {
            if (isIncome) {
                await incomeRepository.delete(record.id);
                incomesRefresh?.();
            } else {
                await expenseRepository.delete(record.id);
                expensesRefresh?.();
            }
            AlertService.fastSuccess();
            onClose();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            if(isIncome) {
                const model = new IncomeModel({ ...record });
                await incomeRepository.update(record.id, model);
                incomesRefresh?.();
            } else {
                const model = new ExpenseModel({ ...record });
                await expenseRepository.update(record.id, model);
                expensesRefresh?.();
            }
            AlertService.fastSuccess();
            onClose();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const title = record.id
        ? (isIncome ? 'Editar Ganho' : 'Editar Gasto')
        : (isIncome ? 'Novo Ganho' : 'Novo Gasto');

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]'>
                <header className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-lg'>{title}</h2>
                    <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                        <ICONS.close />
                    </span>
                </header>
                <div className='px-6 py-4 overflow-y-auto'>
                    <Form>
                        <div className='flex gap-1 w-full'>
                            <div className='flex-1'>
                                <SelectInput
                                    options={FINANCIAL_CATEGORY_TYPES_OPTIONS}
                                    value={categoryType}
                                    setValue={setCategoryType}
                                    disabled={!!record.id}
                                />
                            </div>
                            <div className='flex-1'>
                                {isIncome ? (
                                    <SelectInput
                                        options={INCOME_TYPES_OPTIONS}
                                        value={record.incomeType || INCOME_TYPES.PIX}
                                        setValue={e => setRecord({ ...record, incomeType: e, benefitTypeId: e === INCOME_TYPES.BENEFITS ? record.benefitTypeId : null })}
                                        label='Tipo de recebimento'
                                    />
                                ) : (
                                    <SelectInput
                                        options={PAYMENT_TYPES_OPTIONS.filter(o => o.value !== PAYMENT_TYPES.CREDIT)}
                                        value={record.paymentType || PAYMENT_TYPES.DEBIT}
                                        setValue={e => setRecord({ ...record, paymentType: e, benefitTypeId: e === PAYMENT_TYPES.BENEFITS ? record.benefitTypeId : null })}
                                        label='Tipo de pagamento'
                                    />
                                )}
                            </div>
                        </div>
                        {showBenefitSelector && (
                            <SelectInput
                                options={benefitTypeOptions}
                                value={record.benefitTypeId}
                                setValue={e => setRecord({ ...record, benefitTypeId: e })}
                                placeholder='Tipo de benefício'
                            />
                        )}
                        <div className='flex gap-1 w-full'>
                            <TextInput placeholder='Título'
                                value={record.title}
                                setValue={e => setRecord({ ...record, title: e })}
                            />
                            <DateInput
                                value={record.date}
                                setValue={e => setRecord({ ...record, date: e })}
                            />
                        </div>
                        <TextAreaInput placeholder='Descrição'
                            value={record.description}
                            setValue={e => setRecord({ ...record, description: e })}
                        />
                        <div className='flex gap-1'>
                            {isIncome ? (
                                <AddInput placeholder='Fonte'
                                    data={sources}
                                    value={record.sourceId}
                                    setValue={e => setRecord({ ...record, sourceId: e })}
                                    onCreate={handleAddSource}
                                />
                            ) : (
                                <AddInput placeholder='Beneficiário'
                                    data={payees}
                                    value={record.payeeId}
                                    setValue={e => setRecord({ ...record, payeeId: e })}
                                    onCreate={handleAddPayee}
                                />
                            )}
                            <MoneyInput
                                value={record.amount}
                                setValue={e => setRecord({ ...record, amount: e })}
                            />
                        </div>
                        <TransactionCategorySection
                            record={record}
                            setRecord={setRecord}
                            categories={categories}
                            tags={tags}
                            type={categoryType}
                        />
                        <ActionsSection>
                            {record.id ? (
                                <>
                                    <DefaultBtn
                                        icon={ICONS.trash}
                                        width='50px'
                                        bg='bg-error'
                                        onClick={handleDelete}
                                    />
                                    <DefaultBtn
                                        text='Salvar'
                                        icon={ICONS.check}
                                        width='110px'
                                        onClick={handleUpdate}
                                    />
                                </>
                            ) : (
                                <DefaultBtn
                                    text={isIncome ? 'Criar ganho' : 'Criar gasto'}
                                    icon={ICONS.add}
                                    width='150px'
                                    onClick={handleInsert}
                                />
                            )}
                        </ActionsSection>
                    </Form>
                </div>
            </div>
        </div>
    );
}
