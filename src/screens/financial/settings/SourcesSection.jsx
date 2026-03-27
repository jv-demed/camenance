'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { sourceRepository } from '@/repositories/SourceRepository';
import { SourceModel } from '@/models/SourceModel';
import { AlertService } from '@/services/alertService';
import { TextInput } from '@/components/inputs/TextInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

export function SourcesSection({ sources, user }) {

    const [newName, setNewName] = useState('');
    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    function startEdit(source) {
        setEditingId(source.id);
        setEditName(source.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName('');
    }

    async function handleAdd() {
        if (!newName.trim()) return;
        try {
            const model = new SourceModel({ name: newName.trim(), userId: user.id });
            await sourceRepository.insert(model);
            sources.refresh();
            setNewName('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editName.trim()) return;
        try {
            await sourceRepository.update(id, { name: editName.trim() });
            sources.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await sourceRepository.delete(id);
            sources.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = sources?.list?.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <TextInput placeholder='Nova fonte' value={newName} setValue={setNewName} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                <div className='flex'>
                    <SearchBar value={search} setValue={setSearch} />
                </div>
                {sources?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma fonte cadastrada.</span>
                )}
                {filtered?.map(source => (
                    <div key={source.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === source.id ? (
                            <>
                                <div className='flex-1 mr-2'>
                                    <TextInput value={editName} setValue={setEditName} />
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(source.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span className='text-sm'>{source.name}</span>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(source)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(source.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
