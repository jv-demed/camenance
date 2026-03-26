'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { expenseTagRepository } from '@/repositories/ExpenseTagRepository';
import { expenseCategoryRepository } from '@/repositories/ExpenseCategoryRepository';
import { AlertService } from '@/services/alertService';
import { ICONS } from '@/assets/icons';
import { ExpenseTagModel } from '@/models/ExpenseTagModel';
import { ExpenseCategoryModel } from '@/models/ExpenseCategoryModel';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { DropdownInput } from '@/components/inputs/DropdownInput';
import { DropdownMultiInput } from '@/components/inputs/DropdownMultiInput';

export function ExpenseCategorySection({
    expense,
    setExpense,
    categories,
    tags
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
        const category = new ExpenseCategoryModel({
            ...newCategory,
            color: parseInt(newCategory.color.replace('#', ''), 16),
            userId: user.id
        });
        await expenseCategoryRepository.insert(category);
        AlertService.fastSuccess();
        categories.refresh();
        setCategoryMode(false);
        setNewCategory(objCategory);
    }

    const objTag = {
        title: '',
        color: '#3b82f6',
        categoryId: expense.categoryId
    }

    const [tagMode, setTagMode] = useState(false);
    const [newTag, setNewTag] = useState(objTag);

    useEffect(() => {
        setNewTag(prev => ({ ...prev, categoryId: expense.categoryId }));
    }, [expense.categoryId]);

    async function handleNewTag() {
        if(!newTag.title.trim()) {
            AlertService.error('A tag precisa de um nome.');
            return;
        }
        const tag = new ExpenseTagModel({
            ...newTag,
            color: parseInt(newTag.color.replace('#', ''), 16),
            userId: user.id
        });
        await expenseTagRepository.insert(tag);
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
                            items={categories.list}
                            displayField='title'
                            value={expense.categoryId}
                            setValue={e => setExpense({ ...expense, categoryId: e })}
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
                            items={tags.list.filter(t => t.categoryId == expense.categoryId)}
                            displayField='title'
                            values={expense.tagIds}
                            setValues={e => setExpense({ ...expense, tagIds: e })}
                        />
                        <DefaultBtn
                            icon={ICONS.add}
                            width='50px'
                            onClick={() => setTagMode(true)}
                            disabled={!expense.categoryId}
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