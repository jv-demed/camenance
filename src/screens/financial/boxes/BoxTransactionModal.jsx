'use client'
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/AlertService';
import { BoxService } from '@/services/BoxService';
import { DateService } from '@/services/DateService';
import { PAYMENT_TYPES, PAYMENT_TYPES_OPTIONS } from '@/enums/PaymentTypes';
import { INCOME_TYPES, INCOME_TYPES_OPTIONS } from '@/enums/IncomeTypes';
import { FINANCIAL_CATEGORY_TYPES } from '@/enums/FinancialCategoryTypes';
import { PayeeModel } from '@/models/PayeeModel';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { Form } from '@/components/containers/Form';
import { TextInput } from '@/components/inputs/TextInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DateInput } from '@/components/inputs/DateInput';
import { AddInput } from '@/components/inputs/AddInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { TransactionCategorySection } from '@/screens/financial/transactions/TransactionCategorySection';

const TITLES = {
    deposit: 'Depositar na Caixinha',
    withdraw: 'Resgatar da Caixinha',
    spend: 'Gasto com Saldo da Caixinha',
};

export function BoxTransactionModal({
    isOpen,
    mode,
    onClose,
    box,
    user,
    payees,
    categories,
    tags,
    benefitTypes,
    refresh,
    record,
    setRecord,
}) {
    if (!isOpen || !box) return null;

    const isBenefit = record.paymentType === PAYMENT_TYPES.BENEFITS;
    const benefitTypeOptions = (benefitTypes?.list || []).map(b => ({ value: b.id, label: b.title }));
    const spendPaymentOptions = PAYMENT_TYPES_OPTIONS;

    async function handleAddPayee(newPayee) {
        const payee = new PayeeModel({ ...newPayee, userId: user.id });
        const saved = await payeeRepository.insert(payee);
        return saved?.id;
    }

    async function handleConfirm() {
        if (!record.amount || record.amount <= 0) {
            AlertService.error('Informe um valor válido.');
            return;
        }
        try {
            const payload = {
                box,
                userId: user.id,
                amount: record.amount,
                date: record.date,
                title: record.title || null,
                description: record.description || null,
                paymentType: record.paymentType || null,
                benefitTypeId: record.benefitTypeId || null,
                categoryId: record.categoryId || null,
                payeeId: record.payeeId || null,
                tagIds: record.tagIds?.length ? record.tagIds : null,
            };
            if (mode === 'deposit') await BoxService.deposit(payload);
            else if (mode === 'withdraw') await BoxService.withdraw(payload);
            else if (mode === 'spend') await BoxService.spend(payload);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]'>
                <header className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-lg'>{TITLES[mode]}</h2>
                    <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                        <ICONS.close />
                    </span>
                </header>
                <div className='px-6 py-4 overflow-y-auto'>
                    <Form>
                        {/* Depósito e Resgate: só valor e data */}
                        {(mode === 'deposit' || mode === 'withdraw') && (
                            <div className='flex gap-1 w-full'>
                                <div className='flex-3'>
                                    <MoneyInput
                                        value={record.amount}
                                        setValue={e => setRecord({ ...record, amount: e })}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <DateInput
                                        value={record.date}
                                        setValue={e => setRecord({ ...record, date: e })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Gasto: igual ao modal de expense */}
                        {mode === 'spend' && (
                            <>
                                <SelectInput
                                    options={spendPaymentOptions}
                                    value={record.paymentType || PAYMENT_TYPES.DEBIT}
                                    setValue={e => setRecord({
                                        ...record,
                                        paymentType: e,
                                        benefitTypeId: e === PAYMENT_TYPES.BENEFITS ? record.benefitTypeId : null,
                                    })}
                                    placeholder='Tipo de pagamento'
                                />
                                {isBenefit && (
                                    <SelectInput
                                        options={benefitTypeOptions}
                                        value={record.benefitTypeId}
                                        setValue={e => setRecord({ ...record, benefitTypeId: e })}
                                        placeholder='Tipo de benefício'
                                    />
                                )}
                                <div className='flex gap-1 w-full'>
                                    <TextInput
                                        placeholder='Título'
                                        value={record.title || ''}
                                        setValue={e => setRecord({ ...record, title: e })}
                                    />
                                    <DateInput
                                        value={record.date}
                                        setValue={e => setRecord({ ...record, date: e })}
                                    />
                                </div>
                                <TextAreaInput
                                    placeholder='Descrição'
                                    value={record.description || ''}
                                    setValue={e => setRecord({ ...record, description: e })}
                                />
                                <div className='flex gap-1'>
                                    <AddInput
                                        placeholder='Beneficiário'
                                        data={payees}
                                        value={record.payeeId}
                                        setValue={e => setRecord({ ...record, payeeId: e })}
                                        onCreate={handleAddPayee}
                                    />
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
                                    type={FINANCIAL_CATEGORY_TYPES.EXPENSE}
                                />
                            </>
                        )}

                        <ActionsSection>
                            <DefaultBtn
                                text={mode === 'deposit' ? 'Depositar' : mode === 'withdraw' ? 'Resgatar' : 'Criar gasto'}
                                icon={mode === 'spend' ? ICONS.add : ICONS.check}
                                width='150px'
                                onClick={handleConfirm}
                            />
                        </ActionsSection>
                    </Form>
                </div>
            </div>
        </div>
    );
}
