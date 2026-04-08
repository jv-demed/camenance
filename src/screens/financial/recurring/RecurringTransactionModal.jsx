'use client'
import { useState, useMemo } from 'react';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { sourceRepository } from '@/repositories/SourceRepository';
import { recurringTransactionRepository } from '@/repositories/RecurringTransactionRepository';
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/AlertService';
import { PayeeModel } from '@/models/PayeeModel';
import { SourceModel } from '@/models/SourceModel';
import { RecurringTransactionModel } from '@/models/RecurringTransactionModel';
import { FINANCIAL_CATEGORY_TYPES, FINANCIAL_CATEGORY_TYPES_OPTIONS } from '@/enums/FinancialCategoryTypes';
import { PAYMENT_TYPES, PAYMENT_TYPES_OPTIONS } from '@/enums/PaymentTypes';
import { INCOME_TYPES, INCOME_TYPES_OPTIONS } from '@/enums/IncomeTypes';
import {
    RECURRING_FREQUENCY,
    RECURRING_FREQUENCY_OPTIONS,
    DAYS_OF_WEEK_OPTIONS,
    MONTH_DAY_OPTIONS,
} from '@/enums/RecurringFrequency';
import { Form } from '@/components/containers/Form';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SelectInput } from '@/components/inputs/SelectInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { TransactionCategorySection } from '@/screens/financial/transactions/TransactionCategorySection';

export function RecurringTransactionModal({
    isOpen,
    onClose,
    record,
    setRecord,
    refresh,
    payees,
    sources,
    categories,
    tags,
    creditCards,
    benefitTypes,
    user
}) {

    if (!isOpen) return null;

    const [categoryType, setCategoryType] = useState(
        record.type ?? FINANCIAL_CATEGORY_TYPES.EXPENSE
    );

    const isIncome = categoryType === FINANCIAL_CATEGORY_TYPES.INCOME;
    const frequency = record.frequency || RECURRING_FREQUENCY.MONTHLY;
    const currentPaymentType = record.paymentType || PAYMENT_TYPES.DEBIT;
    const isCredit = !isIncome && currentPaymentType === PAYMENT_TYPES.CREDIT;

    const isBenefitIncome = isIncome && (record.incomeType || INCOME_TYPES.PIX) === INCOME_TYPES.BENEFITS;
    const isBenefitExpense = !isIncome && currentPaymentType === PAYMENT_TYPES.BENEFITS;
    const showBenefitSelector = isBenefitIncome || isBenefitExpense;

    const benefitTypeOptions = (benefitTypes?.list || []).map(b => ({ value: b.id, label: b.title }));

    const creditCardOptions = useMemo(() =>
        (creditCards?.list || []).map(card => ({ value: card.id, label: card.name })),
        [creditCards?.list]
    );

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

    function buildPayload() {
        if (isIncome) {
            return {
                ...record,
                type: categoryType,
                frequency,
                paymentType: null,
                creditCardId: null,
                payeeId: null,
                benefitTypeId: isBenefitIncome ? (record.benefitTypeId ?? null) : null,
            };
        } else {
            return {
                ...record,
                type: categoryType,
                frequency,
                incomeType: null,
                sourceId: null,
                benefitTypeId: isBenefitExpense ? (record.benefitTypeId ?? null) : null,
            };
        }
    }

    async function handleInsert() {
        try {
            const model = new RecurringTransactionModel({
                ...buildPayload(),
                userId: user.id,
                realizedDates: [],
                skippedDates: [],
            });
            await recurringTransactionRepository.insert(model);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            const model = new RecurringTransactionModel(buildPayload());
            await recurringTransactionRepository.update(record.id, model);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete() {
        const confirmed = await AlertService.confirm('Esta ação não pode ser desfeita.');
        if (!confirmed) return;
        try {
            await recurringTransactionRepository.delete(record.id);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    const title = record.id ? 'Editar Recorrência' : 'Nova Recorrência';

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
                                        placeholder='Tipo de recebimento'
                                    />
                                ) : (
                                    <SelectInput
                                        options={PAYMENT_TYPES_OPTIONS}
                                        value={record.paymentType || PAYMENT_TYPES.DEBIT}
                                        setValue={e => setRecord({ ...record, paymentType: e, creditCardId: e === PAYMENT_TYPES.CREDIT ? (creditCardOptions[0]?.value ?? null) : null, benefitTypeId: e === PAYMENT_TYPES.BENEFITS ? record.benefitTypeId : null })}
                                        placeholder='Tipo de pagamento'
                                    />
                                )}
                            </div>
                        </div>
                        <div className='flex gap-1 w-full'>
                            <div className='flex-1'>
                                <SelectInput
                                    options={RECURRING_FREQUENCY_OPTIONS}
                                    value={frequency}
                                    setValue={e => setRecord({ ...record, frequency: e })}
                                />
                            </div>
                            {frequency === RECURRING_FREQUENCY.WEEKLY && (
                                <div className='flex-1'>
                                    <SelectInput
                                        options={DAYS_OF_WEEK_OPTIONS}
                                        value={record.dayOfWeek ?? 1}
                                        setValue={e => setRecord({ ...record, dayOfWeek: e })}
                                        placeholder='Dia da semana'
                                    />
                                </div>
                            )}
                            {frequency === RECURRING_FREQUENCY.MONTHLY && (
                                <div className='flex-1'>
                                    <SelectInput
                                        options={MONTH_DAY_OPTIONS}
                                        value={record.dayOfMonth ?? '1'}
                                        setValue={e => setRecord({ ...record, dayOfMonth: e })}
                                        placeholder='Dia do mês'
                                    />
                                </div>
                            )}
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
                                value={record.startDate}
                                setValue={e => setRecord({ ...record, startDate: e })}
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
                        {isCredit && (
                            <SelectInput
                                options={creditCardOptions}
                                value={record.creditCardId}
                                setValue={e => setRecord({ ...record, creditCardId: e })}
                                placeholder='Cartão de crédito'
                            />
                        )}
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
                                    text='Criar recorrência'
                                    icon={ICONS.add}
                                    width='180px'
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
