'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { benefitTypeRepository } from '@/repositories/BenefitTypeRepository';
import { BenefitTypeModel } from '@/models/BenefitTypeModel';
import { AlertService } from '@/services/AlertService';
import { ColorService } from '@/services/ColorService';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

export function BenefitsSection({ benefitTypes, user }) {

    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState('#6366f1');
    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    function startEdit(benefitType) {
        setEditingId(benefitType.id);
        setEditValues({ title: benefitType.title, color: benefitType.color });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({});
    }

    async function handleAdd() {
        if (!newTitle.trim()) return;
        try {
            const model = new BenefitTypeModel({ title: newTitle.trim(), color: newColor, userId: user.id });
            await benefitTypeRepository.insert(model);
            benefitTypes.refresh();
            setNewTitle('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editValues.title?.trim()) return;
        try {
            await benefitTypeRepository.update(id, { title: editValues.title.trim(), color: editValues.color });
            benefitTypes.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await benefitTypeRepository.delete(id);
            benefitTypes.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = benefitTypes?.list?.filter(b => b.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <ColorInput value={newColor} setValue={setNewColor} width='46px' />
                <div className='flex-1'>
                    <TextInput placeholder='Novo benefício' value={newTitle} setValue={setNewTitle} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                <div className='flex'>
                    <SearchBar value={search} setValue={setSearch} />
                </div>
                {benefitTypes?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhum benefício cadastrado.</span>
                )}
                {filtered?.map(benefitType => (
                    <div key={benefitType.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === benefitType.id ? (
                            <>
                                <div className='flex items-center gap-2 flex-1 mr-2'>
                                    <ColorInput value={editValues.color} setValue={v => setEditValues(p => ({ ...p, color: v }))} width='36px' />
                                    <div className='flex-1'>
                                        <TextInput value={editValues.title} setValue={v => setEditValues(p => ({ ...p, title: v }))} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(benefitType.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <span
                                    className='text-sm font-medium px-3 py-0.5 rounded-full'
                                    style={{
                                        backgroundColor: benefitType.color,
                                        color: ColorService.getContrastColor(benefitType.color)
                                    }}
                                >
                                    {benefitType.title}
                                </span>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(benefitType)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(benefitType.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
