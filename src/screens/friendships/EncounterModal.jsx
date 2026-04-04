'use client'
import { useState } from 'react';
import { EncounterModel } from '@/models/EncounterModel';
import { LocationModel } from '@/models/LocationModel';
import { EncounterPhotoModel } from '@/models/EncounterPhotoModel';
import { encounterRepository } from '@/repositories/EncounterRepository';
import { locationRepository } from '@/repositories/LocationRepository';
import { encounterPhotoRepository } from '@/repositories/EncounterPhotoRepository';
import { StorageService } from '@/services/StorageService';
import { AlertService } from '@/services/alertService';
import { ICONS } from '@/assets/icons';
import { Form } from '@/components/containers/Form';
import { ActionsSection } from '@/components/containers/ActionsSection';
import { DateInput } from '@/components/inputs/DateInput';
import { TextAreaInput } from '@/components/inputs/TextAreaInput';
import { AddInput } from '@/components/inputs/AddInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';

export function EncounterModal({
    isOpen,
    onClose,
    record,
    setRecord,
    preselectedFriend,
    friends,
    locations,
    locationsRefresh,
    encountersRefresh,
    user,
}) {

    if (!isOpen) return null;

    const isEdit = !!record.id;
    const [photoFiles, setPhotoFiles] = useState([]);

    // Amigos selecionados: array de ids
    const friendIds = record.friendIds || (preselectedFriend ? [preselectedFriend.id] : []);

    function toggleFriend(id) {
        const current = record.friendIds || (preselectedFriend ? [preselectedFriend.id] : []);
        const next = current.includes(id)
            ? current.filter(fid => fid !== id)
            : [...current, id];
        setRecord({ ...record, friendIds: next });
    }

    async function handleAddLocation(newLoc) {
        const loc = new LocationModel({ ...newLoc, userId: user.id });
        const saved = await locationRepository.insert(loc);
        return saved?.id;
    }

    async function handleInsert() {
        try {
            const model = new EncounterModel({
                ...record,
                userId: user.id,
                friendIds: record.friendIds || (preselectedFriend ? [preselectedFriend.id] : []),
            });
            const saved = await encounterRepository.insert(model);

            if (photoFiles.length > 0 && saved?.id) {
                await Promise.all(photoFiles.map(async file => {
                    const { bucket, path } = await StorageService.upload(user.id, saved.id, file);
                    const photo = new EncounterPhotoModel({ encounterId: saved.id, userId: user.id, bucket, path });
                    await encounterPhotoRepository.insert(photo);
                }));
            }

            encountersRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    async function handleUpdate() {
        try {
            const model = new EncounterModel({ ...record });
            await encounterRepository.update(record.id, model);

            if (photoFiles.length > 0) {
                await Promise.all(photoFiles.map(async file => {
                    const { bucket, path } = await StorageService.upload(user.id, record.id, file);
                    const photo = new EncounterPhotoModel({ encounterId: record.id, userId: user.id, bucket, path });
                    await encounterPhotoRepository.insert(photo);
                }));
            }

            encountersRefresh?.();
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
            await encounterRepository.delete(record.id);
            encountersRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    function handlePhotoChange(e) {
        const files = Array.from(e.target.files);
        setPhotoFiles(prev => [...prev, ...files]);
    }

    function removePhotoFile(index) {
        setPhotoFiles(prev => prev.filter((_, i) => i !== index));
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh]'>
                <header className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
                    <h2 className='text-lg'>{isEdit ? 'Editar encontro' : 'Registrar encontro'}</h2>
                    <span onClick={onClose} className='text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                        <ICONS.close />
                    </span>
                </header>
                <div className='px-6 py-4 overflow-y-auto'>
                    <Form>
                        {/* Seleção de amigos */}
                        <div className='flex flex-col gap-1'>
                            <label className='text-sm text-gray-500'>Amigos presentes</label>
                            <div className='flex flex-wrap gap-2'>
                                {friends.map(f => {
                                    const selected = (record.friendIds || (preselectedFriend ? [preselectedFriend.id] : [])).includes(f.id);
                                    return (
                                        <button
                                            key={f.id}
                                            type='button'
                                            onClick={() => toggleFriend(f.id)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-sm border transition-all
                                                ${selected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-600 border-border hover:border-primary'
                                                }
                                            `}
                                        >
                                            {f.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className='flex gap-2'>
                            <div className='flex-1'>
                                <AddInput
                                    placeholder='Local'
                                    data={locations}
                                    value={record.locationId}
                                    setValue={v => setRecord({ ...record, locationId: v })}
                                    onCreate={handleAddLocation}
                                />
                            </div>
                            <DateInput
                                value={record.date || ''}
                                setValue={v => setRecord({ ...record, date: v })}
                                width='140px'
                            />
                        </div>

                        <TextAreaInput
                            placeholder='Notas sobre o encontro'
                            value={record.notes || ''}
                            setValue={v => setRecord({ ...record, notes: v })}
                        />

                        {/* Upload de fotos */}
                        <div className='flex flex-col gap-2'>
                            <label className='text-sm text-gray-500'>Fotos</label>
                            <label className='flex items-center gap-2 px-3 py-2 border border-dashed border-border rounded-xl cursor-pointer hover:border-primary text-sm text-gray-500 hover:text-primary transition-colors'>
                                <ICONS.add className='text-lg' />
                                <span>Adicionar fotos</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    className='hidden'
                                    onChange={handlePhotoChange}
                                />
                            </label>
                            {photoFiles.length > 0 && (
                                <div className='flex flex-wrap gap-2'>
                                    {photoFiles.map((file, i) => (
                                        <div key={i} className='relative'>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className='w-16 h-16 object-cover rounded-lg border border-border'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => removePhotoFile(i)}
                                                className='absolute -top-1.5 -right-1.5 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'
                                            >
                                                <ICONS.close />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                    text='Registrar'
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
