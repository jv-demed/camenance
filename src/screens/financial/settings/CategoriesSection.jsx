'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { FinancialCategoryModel } from '@/models/FinancialCategoryModel';
import { FINANCIAL_CATEGORY_TYPES, FINANCIAL_CATEGORY_TYPES_LABELS, FINANCIAL_CATEGORY_TYPES_OPTIONS } from '@/enums/FinancialCategoryTypes';
import { AlertService } from '@/services/AlertService';
import { ColorService } from '@/services/ColorService';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { SelectInput } from '@/components/inputs/SelectInput';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

const TYPE_FILTER_OPTIONS = ['Todas', ...Object.values(FINANCIAL_CATEGORY_TYPES_LABELS)];

export function CategoriesSection({ categories, user }) {

    const [newTitle, setNewTitle] = useState('');
    const [newColor, setNewColor] = useState('#6366f1');
    const [newType, setNewType] = useState(FINANCIAL_CATEGORY_TYPES.EXPENSE);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todas');

    const [editingId, setEditingId] = useState(null);
    const [editValues, setEditValues] = useState({});

    function startEdit(category) {
        setEditingId(category.id);
        setEditValues({ title: category.title, color: category.color, type: category.type });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditValues({});
    }

    async function handleAdd() {
        if (!newTitle.trim()) return;
        try {
            const model = new FinancialCategoryModel({ title: newTitle.trim(), color: newColor, type: newType, userId: user.id });
            await financialCategoryRepository.insert(model);
            categories.refresh();
            setNewTitle('');
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editValues.title?.trim()) return;
        try {
            await financialCategoryRepository.update(id, { title: editValues.title.trim(), color: editValues.color, type: editValues.type });
            categories.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await financialCategoryRepository.delete(id);
            categories.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = categories?.list
        ?.filter(c => typeFilter === 'Todas' || FINANCIAL_CATEGORY_TYPES_LABELS[c.type] === typeFilter)
        .filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2'>
                <ColorInput value={newColor} setValue={setNewColor} width='46px' />
                <div className='flex-1'>
                    <TextInput placeholder='Nova categoria' value={newTitle} setValue={setNewTitle} />
                </div>
                <div className='w-36'>
                    <SelectInput options={FINANCIAL_CATEGORY_TYPES_OPTIONS} value={newType} setValue={setNewType} />
                </div>
                <IconBtn icon={ICONS.add} onClick={handleAdd} />
            </div>

            <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-center'>
                    <SearchBar value={search} setValue={setSearch} />
                    <SelectMiniInput options={TYPE_FILTER_OPTIONS} value={typeFilter} setValue={setTypeFilter} />
                </div>
                {categories?.list?.length === 0 && (
                    <span className='text-sm text-gray-400'>Nenhuma categoria cadastrada.</span>
                )}
                {filtered?.map(category => (
                    <div key={category.id} className='flex items-center justify-between px-3 py-2 rounded-lg border border-gray-100 hover:bg-gray-50'>
                        {editingId === category.id ? (
                            <>
                                <div className='flex items-center gap-2 flex-1 mr-2'>
                                    <ColorInput value={editValues.color} setValue={v => setEditValues(p => ({ ...p, color: v }))} width='36px' />
                                    <div className='flex-1'>
                                        <TextInput value={editValues.title} setValue={v => setEditValues(p => ({ ...p, title: v }))} />
                                    </div>
                                    <div className='w-32'>
                                        <SelectInput options={FINANCIAL_CATEGORY_TYPES_OPTIONS} value={editValues.type} setValue={v => setEditValues(p => ({ ...p, type: v }))} />
                                    </div>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(category.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='flex items-center gap-3'>
                                    <span
                                        className='text-sm font-medium px-3 py-0.5 rounded-full'
                                        style={{
                                            backgroundColor: category.color,
                                            color: ColorService.getContrastColor(category.color)
                                        }}
                                    >
                                        {category.title}
                                    </span>
                                    <span className='text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full'>
                                        {FINANCIAL_CATEGORY_TYPES_LABELS[category.type]}
                                    </span>
                                </div>
                                <div className='flex gap-1'>
                                    <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(category)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(category.id)} />
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
