'use client'
import { useState } from 'react';
import { FriendModel } from '@/models/FriendModel';
import { friendRepository } from '@/repositories/FriendRepository';
import { FRIENDSHIP_LEVEL, FRIENDSHIP_LEVEL_OPTIONS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE, MAINTENANCE_OPTIONS } from '@/enums/MaintenanceTypes';
import { AlertService } from '@/services/AlertService';
import { ICONS } from '@/assets/icons';
import { Form } from '@/components/containers/Form';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { TextInput } from '@/components/inputs/TextInput';
import { DateInput } from '@/components/inputs/DateInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';

export function FriendModal({ isOpen, onClose, record, setRecord, friendsRefresh, user }) {

    if (!isOpen) return null;

    const isEdit = !!record.id;

    async function handleInsert() {
        try {
            const model = new FriendModel({
                ...record,
                userId: user.id,
                friendshipLevel: record.friendshipLevel || FRIENDSHIP_LEVEL.FRIEND,
                maintenance: record.maintenance || MAINTENANCE.MEDIUM,
            });
            await friendRepository.insert(model);
            friendsRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            const model = new FriendModel({ ...record });
            await friendRepository.update(record.id, model);
            friendsRefresh?.();
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
            await friendRepository.delete(record.id);
            friendsRefresh?.();
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
                    <h2 className='text-lg'>{isEdit ? 'Editar amigo' : 'Novo amigo'}</h2>
                    <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                        <ICONS.close />
                    </span>
                </header>
                <div className='px-6 py-4 overflow-y-auto'>
                    <Form>
                        <TextInput
                            placeholder='Nome'
                            value={record.name || ''}
                            setValue={v => setRecord({ ...record, name: v })}
                            required
                        />
                        <div className='flex gap-2'>
                            <SelectInput
                                options={FRIENDSHIP_LEVEL_OPTIONS}
                                value={record.friendshipLevel || FRIENDSHIP_LEVEL.FRIEND}
                                setValue={v => setRecord({ ...record, friendshipLevel: v })}
                                placeholder='Nível de amizade'
                            />
                            <SelectInput
                                options={MAINTENANCE_OPTIONS}
                                value={record.maintenance || MAINTENANCE.MEDIUM}
                                setValue={v => setRecord({ ...record, maintenance: v })}
                                placeholder='Manutenção'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-500'>Aniversário (opcional)</label>
                            <DateInput
                                value={record.birthday || ''}
                                setValue={v => setRecord({ ...record, birthday: v })}
                                width='100%'
                            />
                        </div>
                        <ActionsSection>
                            {isEdit ? (
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
                                    text='Criar amigo'
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
