'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { FinancialTagModel } from '@/models/FinancialTagModel';
import { AlertService } from '@/services/alertService';
import { ColorService } from '@/services/ColorService';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

export function TagsSection({ tags, categories, user }) {

    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState('6366f1');
    const [newCategoryId, setNewCategoryId] = useState('');
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Todas');

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    const categoryOptions = categories?.list?.map(c => ({ value: c.id, label: c.title })) ?? [];
    const categoryFilterOptions = ['Todas', ...(categories?.list?.map(c => c.title) ?? [])];

    function startEdit(tag) {
        setEditingId(tag.id);
        setEditValues({ title: tag.title, color: tag.color, categoryId: tag.categoryId ?? '' });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({});
    }

    async function handleAdd() {
        if (!newTitle.trim()) return;
        try {
            const model = new FinancialTagModel({ title: newTitle.trim(), color: newColor, categoryId: newCategoryId || null, userId: user.id });
            await financialTagRepository.insert(model);
            tags.refresh();
            setNewTitle('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editValues.title?.trim()) return;
        try {
            await financialTagRepository.update(id, { title: editValues.title.trim(), color: editValues.color, categoryId: editValues.categoryId || null });
            tags.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await financialTagRepository.delete(id);
            tags.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = tags?.list
        ?.filter(t => categoryFilter === 'Todas' || categories?.list?.find(c => c.id === t.categoryId)?.title === categoryFilter)
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <ColorInput value={ColorService.numberToHex(newColor)} setValue={v => setNewColor(v.replace('#', ''))} width='46px' />
                <div className='flex-1'>
                    <TextInput placeholder='Nova tag' value={newTitle} setValue={setNewTitle} />
                </div>
                <div className='w-36'>
                    <SelectInput options={categoryOptions} value={newCategoryId} setValue={setNewCategoryId} placeholder='Categoria' />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                    <SearchBar value={search} setValue={setSearch} />
                    <SelectMiniInput options={categoryFilterOptions} value={categoryFilter} setValue={setCategoryFilter} />
                </div>
                {tags?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma tag cadastrada.</span>
                )}
                {filtered?.map(tag => {
                    const category = categories?.list?.find(c => c.id === tag.categoryId);
                    return (
                        <div key={tag.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                            {editingId === tag.id ? (
                                <>
                                    <div className='flex items-center gap-2 flex-1 mr-2'>
                                        <ColorInput value={ColorService.numberToHex(editValues.color)} setValue={v => setEditValues(p => ({ ...p, color: v.replace('#', '') }))} width='36px' />
                                        <div className='flex-1'>
                                            <TextInput value={editValues.title} setValue={v => setEditValues(p => ({ ...p, title: v }))} />
                                        </div>
                                        <div className='w-32'>
                                            <SelectInput options={categoryOptions} value={editValues.categoryId} setValue={v => setEditValues(p => ({ ...p, categoryId: v }))} placeholder='Categoria' />
                                        </div>
                                    </div>
                                    <div className='flex gap-1'>
                                        <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(tag.id)} />
                                        <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className='flex items-center gap-3'>
                                        <span
                                            className='text-sm font-medium px-3 py-0.5 rounded-full'
                                            style={{
                                                backgroundColor: ColorService.numberToHex(tag.color),
                                                color: ColorService.getContrastColor(tag.color)
                                            }}
                                        >
                                            {tag.title}
                                        </span>
                                        {category && (
                                            <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                                                {category.title}
                                            </span>
                                        )}
                                    </div>
                                    <div className='flex gap-1'>
                                        <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(tag)} />
                                        <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(tag.id)} />
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
