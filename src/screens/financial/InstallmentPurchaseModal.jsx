'use client'
import { useMemo } from 'react';
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/alertService';
import { InstallmentPurchaseModel } from '@/models/InstallmentPurchaseModel';
import { installmentPurchaseRepository } from '@/repositories/InstallmentPurchaseRepository';
import { PayeeModel } from '@/models/PayeeModel';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { FINANCIAL_CATEGORY_TYPES } from '@/enums/FinancialCategoryTypes';
import { Form } from '@/components/containers/Form';
import { AddInput } from '@/components/inputs/AddInput';
import { DateInput } from '@/components/inputs/DateInput';
import { TextInput } from '@/components/inputs/TextInput';
import { NumberInput } from '@/components/inputs/NumberInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SelectInput } from '@/components/inputs/SelectInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { TransactionCategorySection } from '@/screens/financial/TransactionCategorySection';

export function InstallmentPurchaseModal({
    isOpen,
    onClose,
    record,
    setRecord,
    refresh,
    payees,
    categories,
    tags,
    creditCards,
    user,
    paidCount = 0
}) {

    if (!isOpen) return null;

    const hasPayments = paidCount > 0;

    const creditCardOptions = useMemo(() => {
        return (creditCards?.list || []).map(card => ({
            value: card.id,
            label: card.name
        }));
    }, [creditCards?.list]);

    async function handleAddPayee(newPayee) {
        const payee = new PayeeModel({ ...newPayee, userId: user.id });
        const saved = await payeeRepository.insert(payee);
        return saved?.id;
    }

    async function handleInsert() {
        try {
            const model = new InstallmentPurchaseModel({ ...record, userId: user.id });
            await installmentPurchaseRepository.insert(model);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            const model = new InstallmentPurchaseModel({ ...record });
            await installmentPurchaseRepository.update(record.id, model);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete() {
        const confirmed = await AlertService.confirm('A compra será removida. Os pagamentos já realizados serão mantidos.');
        if (!confirmed) return;
        try {
            await installmentPurchaseRepository.delete(record.id);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    const title = record.id ? 'Editar Compra Parcelada' : 'Nova Compra Parcelada';

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
                        <div className='flex gap-1'>
                            <TextInput
                                placeholder='Título'
                                value={record.title}
                                setValue={e => setRecord({ ...record, title: e })}
                            />
                            <DateInput
                                value={record.startDate}
                                setValue={e => setRecord({ ...record, startDate: e })}
                                disabled={hasPayments}
                            />
                        </div>
                        <TextAreaInput
                            placeholder='Descrição'
                            value={record.description}
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
                                value={record.totalAmount}
                                setValue={e => setRecord({ ...record, totalAmount: e })}
                                disabled={hasPayments}
                            />
                        </div>
                        <div className='flex gap-1'>
                            <div className='flex-1'>
                                <SelectInput
                                    options={creditCardOptions}
                                    value={record.creditCardId}
                                    setValue={e => setRecord({ ...record, creditCardId: e })}
                                    label='Cartão'
                                    disabled={hasPayments}
                                />
                            </div>
                            <div className='w-24'>
                                <NumberInput
                                    placeholder='Parcelas'
                                    value={record.installmentTotal}
                                    setValue={e => setRecord({ ...record, installmentTotal: Math.max(2, parseInt(e) || 2) })}
                                    min={2}
                                    disabled={hasPayments}
                                />
                            </div>
                        </div>
                        <TransactionCategorySection
                            record={record}
                            setRecord={setRecord}
                            categories={categories}
                            tags={tags}
                            type={FINANCIAL_CATEGORY_TYPES.EXPENSE}
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
                                    text='Criar compra'
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
