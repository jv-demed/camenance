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
            <div className='bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh] shadow-xl'>
                
                {/* Header */}
                <header className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <h2 className='font-semibold text-gray-800'>
                        {isEdit ? 'Editar amigo' : 'Novo amigo'}
                    </h2>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-700 transition-colors text-xl'>
                        <ICONS.close />
                    </button>
                </header>

                <div className='px-6 py-5 overflow-y-auto'>
                    <Form>
                        
                        {/* Nome */}
                        <div className='flex flex-col gap-1.5 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Nome do amigo</span>
                            <TextInput
                                placeholder='Ex: João Silva'
                                value={record.name || ''}
                                setValue={v => setRecord({ ...record, name: v })}
                                required
                            />
                        </div>

                        {/* Configurações de Relacionamento */}
                        <div className='flex gap-3 w-full'>
                            <div className='flex flex-col gap-1.5 flex-1'>
                                <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Nível</span>
                                <SelectInput
                                    options={FRIENDSHIP_LEVEL_OPTIONS}
                                    value={record.friendshipLevel || FRIENDSHIP_LEVEL.FRIEND}
                                    setValue={v => setRecord({ ...record, friendshipLevel: v })}
                                    placeholder='Selecione'
                                />
                            </div>
                            <div className='flex flex-col gap-1.5 flex-1'>
                                <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Manutenção</span>
                                <SelectInput
                                    options={MAINTENANCE_OPTIONS}
                                    value={record.maintenance || MAINTENANCE.MEDIUM}
                                    setValue={v => setRecord({ ...record, maintenance: v })}
                                    placeholder='Frequência'
                                />
                            </div>
                        </div>

                        {/* Aniversário */}
                        <div className='flex flex-col gap-1.5 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Aniversário <span className="lowercase font-normal text-[10px] ml-1">(opcional)</span></span>
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
                                    text='Registrar amigo'
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
