'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { financialTagRepository } from '@/repositories/FinancialTagRepository';
import { financialCategoryRepository } from '@/repositories/FinancialCategoryRepository';
import { AlertService } from '@/services/alertService';
import { ICONS } from '@/assets/icons';
import { FinancialTagModel } from '@/models/FinancialTagModel';
import { FinancialCategoryModel } from '@/models/FinancialCategoryModel';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { DropdownInput } from '@/components/inputs/DropdownInput';
import { DropdownMultiInput } from '@/components/inputs/DropdownMultiInput';

export function TransactionCategorySection({
    record,
    setRecord,
    categories,
    tags,
    type
}) {

    const { user } = useUser();

    const objCategory = {
        title: '',
        color: '#3b82f6'
    }

    const [categoryMode, setCategoryMode] = useState(false);
    const [newCategory, setNewCategory] = useState(objCategory);

    async function handleNewCategory() {
        if(!newCategory.title.trim()) {
            AlertService.error('A categoria precisa de um nome.');
            return;
        }
        const category = new FinancialCategoryModel({
            ...newCategory,
            color: parseInt(newCategory.color.replace('#', ''), 16),
            userId: user.id,
            type: type
        });
        await financialCategoryRepository.insert(category);
        AlertService.fastSuccess();
        categories.refresh();
        setCategoryMode(false);
        setNewCategory(objCategory);
    }

    const objTag = {
        title: '',
        color: '#3b82f6',
        categoryId: record.categoryId
    }

    const [tagMode, setTagMode] = useState(false);
    const [newTag, setNewTag] = useState(objTag);

    useEffect(() => {
        setNewTag(prev => ({ ...prev, categoryId: record.categoryId }));
    }, [record.categoryId]);

    async function handleNewTag() {
        if(!newTag.title.trim()) {
            AlertService.error('A tag precisa de um nome.');
            return;
        }
        const tag = new FinancialTagModel({
            ...newTag,
            color: parseInt(newTag.color.replace('#', ''), 16),
            userId: user.id
        });
        await financialTagRepository.insert(tag);
        AlertService.fastSuccess();
        tags.refresh();
        setTagMode(false);
        setNewTag(objTag);
    }

    return (
        <div className='w-full'>
            {(!categoryMode && !tagMode) ?
                <div className='flex flex-col gap-2'>
                    <div className='flex gap-1'>
                        <DropdownInput
                            placeholder='Categoria'
                            items={categories.list.filter(c => c.type === type)}
                            displayField='title'
                            value={record.categoryId}
                            setValue={e => setRecord({ ...record, categoryId: e })}
                        />
                        <DefaultBtn
                            icon={ICONS.add}
                            width='50px'
                            onClick={() => setCategoryMode(true)}
                        />
                    </div>
                    <div className='flex gap-1'>
                        <DropdownMultiInput
                            placeholder='Tags'
                            items={tags.list.filter(t => t.categoryId == record.categoryId)}
                            displayField='title'
                            values={record.tagIds}
                            setValues={e => setRecord({ ...record, tagIds: e })}
                        />
                        <DefaultBtn
                            icon={ICONS.add}
                            width='50px'
                            onClick={() => setTagMode(true)}
                            disabled={!record.categoryId}
                        />
                    </div>
                </div> :
                <div className='flex flex-col gap-2'>
                    {categoryMode && <>
                        <div className='flex gap-1'>
                            <TextInput placeholder='Nome da categoria'
                                value={newCategory.title}
                                setValue={e => setNewCategory({ ...newCategory, title: e })}
                            />
                            <ColorInput
                                value={newCategory.color}
                                setValue={e => setNewCategory({ ...newCategory, color: e })}
                            />
                        </div>
                        <div className='flex justify-end gap-1'>
                            <DefaultBtn
                                text='Cancelar'
                                width='90px'
                                bg='bg-error'
                                onClick={() => setCategoryMode(false)}
                            />
                            <DefaultBtn
                                text='Salvar Categoria'
                                icon={ICONS.check}
                                width='175px'
                                onClick={handleNewCategory}
                            />
                        </div>
                    </>}
                    {tagMode && <>
                        <div className='flex gap-1'>
                            <TextInput placeholder='Nome da tag'
                                value={newTag.title}
                                setValue={e => setNewTag({ ...newTag, title: e })}
                            />
                            <ColorInput
                                value={newTag.color}
                                setValue={e => setNewTag({ ...newTag, color: e })}
                            />
                        </div>
                        <div className='flex justify-end gap-1'>
                            <DefaultBtn
                                text='Cancelar'
                                width='90px'
                                bg='bg-error'
                                onClick={() => setTagMode(false)}
                            />
                            <DefaultBtn
                                text='Salvar Tag'
                                icon={ICONS.check}
                                width='170px'
                                onClick={handleNewTag}
                            />
                        </div>
                    </>}
                </div>
            }
        </div>
    )
}
