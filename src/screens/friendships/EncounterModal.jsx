'use client'
import { useEffect, useState } from 'react';
import { EncounterModel } from '@/models/EncounterModel';
import { LocationModel } from '@/models/LocationModel';
import { EncounterPhotoModel } from '@/models/EncounterPhotoModel';
import { encounterRepository } from '@/repositories/EncounterRepository';
import { locationRepository } from '@/repositories/LocationRepository';
import { encounterPhotoRepository } from '@/repositories/EncounterPhotoRepository';
import { StorageService } from '@/services/StorageService';
import { BucketNames } from '@/assets/BucketNames';
import { AlertService } from '@/services/AlertService';
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
    const isEdit = !!record.id;
    const [photoFiles, setPhotoFiles] = useState([]);
    const [existingPhotos, setExistingPhotos] = useState([]);

    useEffect(() => {
        if (isOpen && isEdit && record.id) {
            encounterPhotoRepository
                .findAll({ encounterId: record.id })
                .then(async photos => {
                    const withUrls = await Promise.all(
                        photos.map(async p => ({
                            ...p,
                            url: await StorageService.getUrl(p.bucket, p.path),
                        }))
                    );
                    setExistingPhotos(withUrls);
                })
                .catch(() => setExistingPhotos([]));
        } else {
            setExistingPhotos([]);
        }
        setPhotoFiles([]);
    }, [isOpen, record.id]);

    if (!isOpen) return null;

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
                    const { bucket, path } = await StorageService.upload(BucketNames.ENCOUNTER_PHOTOS, user.id, saved.id, file);
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
                    const { bucket, path } = await StorageService.upload(BucketNames.ENCOUNTER_PHOTOS, user.id, record.id, file);
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

    const selectedFriendIds = record.friendIds || (preselectedFriend ? [preselectedFriend.id] : []);
    const hasPhotos = existingPhotos.length > 0 || photoFiles.length > 0;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh] shadow-xl'>

                {/* Header */}
                <header className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <h2 className='font-semibold text-gray-800'>
                        {isEdit ? 'Editar encontro' : 'Registrar encontro'}
                    </h2>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-700 transition-colors text-xl'>
                        <ICONS.close />
                    </button>
                </header>

                <div className='px-6 py-5 overflow-y-auto'>
                    <Form>

                        {/* Amigos */}
                        <div className='flex flex-col gap-2 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Amigos presentes</span>
                            <div className='flex flex-wrap gap-1.5'>
                                {friends.map(f => {
                                    const selected = selectedFriendIds.includes(f.id);
                                    return (
                                        <button
                                            key={f.id}
                                            type='button'
                                            onClick={() => toggleFriend(f.id)}
                                            className={`
                                                px-3 py-1.5 rounded-lg text-sm border transition-all
                                                ${selected
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'text-gray-500 border-border hover:border-primary hover:text-primary'
                                                }
                                            `}
                                        >
                                            {f.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Local */}
                        <div className='flex flex-col gap-1.5 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Local</span>
                            <AddInput
                                placeholder='Onde foi?'
                                data={locations}
                                value={record.locationId}
                                setValue={v => setRecord({ ...record, locationId: v })}
                                onCreate={handleAddLocation}
                            />
                        </div>

                        {/* Data */}
                        <div className='flex flex-col gap-1.5 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Data</span>
                            <DateInput
                                value={record.date || ''}
                                setValue={v => setRecord({ ...record, date: v })}
                                width='100%'
                            />
                        </div>

                        {/* Notas */}
                        <div className='flex flex-col gap-1.5 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Notas</span>
                            <TextAreaInput
                                placeholder='Como foi o encontro?'
                                value={record.notes || ''}
                                setValue={v => setRecord({ ...record, notes: v })}
                            />
                        </div>

                        {/* Fotos */}
                        <div className='flex flex-col gap-2 w-full'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Fotos</span>

                            {hasPhotos && (
                                <div className='grid grid-cols-4 gap-2'>
                                    {existingPhotos.map(photo => (
                                        <img
                                            key={photo.id}
                                            src={photo.url}
                                            alt='foto do encontro'
                                            className='w-full aspect-square object-cover rounded-xl border border-border'
                                        />
                                    ))}
                                    {photoFiles.map((file, i) => (
                                        <div key={i} className='relative'>
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={file.name}
                                                className='w-full aspect-square object-cover rounded-xl border border-border'
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

                            <label className='flex items-center justify-center gap-2 px-3 py-2.5 border border-dashed border-border rounded-xl cursor-pointer hover:border-primary text-sm text-gray-400 hover:text-primary transition-colors'>
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
