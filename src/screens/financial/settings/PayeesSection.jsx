'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { payeeRepository } from '@/repositories/PayeeRepository';
import { PayeeModel } from '@/models/PayeeModel';
import { AlertService } from '@/services/alertService';
import { TextInput } from '@/components/inputs/TextInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

export function PayeesSection({ payees, user }) {

    const [newName, setNewName] = useState('');
    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    function startEdit(payee) {
        setEditingId(payee.id);
        setEditName(payee.name);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditName('');
    }

    async function handleAdd() {
        if (!newName.trim()) return;
        try {
            const model = new PayeeModel({ name: newName.trim(), userId: user.id });
            await payeeRepository.insert(model);
            payees.refresh();
            setNewName('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editName.trim()) return;
        try {
            await payeeRepository.update(id, { name: editName.trim() });
            payees.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await payeeRepository.delete(id);
            payees.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = payees?.list?.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <TextInput placeholder='Novo beneficiário' value={newName} setValue={setNewName} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                <div className='flex'>
                    <SearchBar value={search} setValue={setSearch} />
                </div>
                {payees?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhum beneficiário cadastrado.</span>
                )}
                {filtered?.map(payee => (
                    <div key={payee.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === payee.id ? (
                            <>
                                <div className='flex-1 mr-2'>
                                    <TextInput value={editName} setValue={setEditName} />
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(payee.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span className='text-sm'>{payee.name}</span>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(payee)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(payee.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
