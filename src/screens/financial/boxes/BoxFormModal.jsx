'use client'
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/AlertService';
import { BoxModel } from '@/models/BoxModel';
import { BoxService } from '@/services/BoxService';
import { DateService } from '@/services/DateService';
import { boxRepository } from '@/repositories/BoxRepository';

import { Form } from '@/components/containers/Form';
import { TextInput } from '@/components/inputs/TextInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { NumberInput } from '@/components/inputs/NumberInput';
import { MoneyInput } from '@/components/inputs/MoneyInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ActionsSection } from '@/components/containers/ActionsSection';

const TYPE_OPTIONS = [
    { value: BoxModel.TYPE.SIMPLE, label: 'Simples' },
    { value: BoxModel.TYPE.NUBANK, label: 'Nubank (rende CDI)' },
];

export function BoxFormModal({ isOpen, onClose, record, setRecord, refresh, user }) {
    if (!isOpen) return null;

    const isNew = !record.id;
    const isNubank = record.type === BoxModel.TYPE.NUBANK;
    const title = isNew ? 'Nova Caixinha' : 'Editar Caixinha';

    async function handleInsert() {
        try {
            const model = new BoxModel({ ...record, userId: user.id });
            const saved = await boxRepository.insert(model);

            if (saved && record.initialBalance > 0) {
                await BoxService.initialDeposit({
                    box: saved,
                    userId: user.id,
                    amount: record.initialBalance,
                    date: record.initialBalanceDate || DateService.dateToSqlDate(new Date()),
                });
            }

            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            const model = new BoxModel({ ...record });
            await boxRepository.update(record.id, model);
            refresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete() {
        const confirmed = await AlertService.confirm(
            'A caixinha será removida. Esta ação só deve ser feita se o saldo estiver zerado.'
        );
        if (!confirmed) return;
        try {
            await boxRepository.delete(record.id);
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
                    <h2 className='text-lg'>{title}</h2>
                    <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                        <ICONS.close />
                    </span>
                </header>
                <div className='px-6 py-4 overflow-y-auto'>
                    <Form>
                        <div className='flex gap-1 w-full'>
                            <TextInput
                                placeholder='Nome'
                                value={record.name}
                                setValue={e => setRecord({ ...record, name: e })}
                            />
                            <ColorInput
                                value={record.color || '#7c3aed'}
                                setValue={e => setRecord({ ...record, color: e })}
                            />
                        </div>
                        <TextAreaInput
                            placeholder='Descrição'
                            value={record.description || ''}
                            setValue={e => setRecord({ ...record, description: e })}
                        />
                        <SelectInput
                            options={TYPE_OPTIONS}
                            value={record.type}
                            setValue={e => setRecord({
                                ...record,
                                type: e,
                                cdiPercentage: e === BoxModel.TYPE.NUBANK ? (record.cdiPercentage || 100) : null,
                            })}
                            placeholder='Tipo'
                        />
                        {(isNubank || isNew) && (
                            <div className='flex gap-1 w-full'>
                                {isNubank && (
                                    <div className='w-32'>
                                        <NumberInput
                                            placeholder='% CDI'
                                            value={record.cdiPercentage ?? 100}
                                            setValue={e => setRecord({ ...record, cdiPercentage: parseFloat(e) || 0 })}
                                            min={0}
                                        />
                                    </div>
                                )}
                                {isNew && (
                                    <div className='flex-1'>
                                        <MoneyInput
                                            placeholder='Saldo inicial (opcional)'
                                            value={record.initialBalance || 0}
                                            setValue={e => setRecord({ ...record, initialBalance: e })}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        <ActionsSection>
                            {!isNew ? (
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
                                    text='Criar caixinha'
                                    icon={ICONS.add}
                                    width='160px'
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
