'use client'
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { insertTag } from '@/controllers/expenses/tagController';
import { insertCategory } from '@/controllers/expenses/categoryController';
import { AlertService } from '@/services/alertService';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SelectInput } from '@/components/inputs/SelectInput';
import { MultiSelectInput } from '@/components/inputs/MultiSelectInput';

export function CategorySection({
    expense,
    setExpense,
    categories,
    tags
}) {

    const { obj: user } = useUser();

    const objCategory = {
        name: '',
        color: '#3b82f6'
    }

    const [categoryMode, setCategoryMode] = useState(false);
    const [newCategory, setNewCategory] = useState(objCategory);

    async function handleNewCategory() {
        const message = await insertCategory({
            ...newCategory,
            idUser: user.id
        });
        if(message) {
            AlertService.error(message);
        } else {
            AlertService.fastSuccess();
            categories.refresh();
            setCategoryMode(false);
            setNewCategory(objCategory);
        }
    }

    const objTag = {
        name: '',
        color: '#3b82f6',
        idCategory: expense.idCategory
    }
    
    const [tagMode, setTagMode] = useState(false);
    const [newTag, setNewTag] = useState(objTag);

    useEffect(() => {
        setNewTag({ ...newTag, idCategory: expense.idCategory });
    }, [expense.idCategory]);

    async function handleNewTag() {
        const message = await insertTag({
            ...newTag,
            idUser: user.id
        });
        if(message) {
            AlertService.error(message);
        } else {
            AlertService.fastSuccess();
            tags.refresh();
            setTagMode(false);
            setNewTag(objTag);
        }
    }

    return (
        <div>
            {(!categoryMode && !tagMode)
                ? <div className='flex flex-col gap-2'>
                    <div className='flex gap-1'>
                        <SelectInput
                            placeholder='Categoria'
                            items={categories.list}
                            value={expense.idCategory}
                            setValue={e => setExpense({ ...expense, idCategory: e })}
                        />
                        <DefaultBtn 
                            icon={ICONS.add}
                            width='50px'
                            onClick={() => setCategoryMode(true)}
                        />
                    </div> 
                    <div className='flex gap-1'>
                        <MultiSelectInput 
                            placeholder='Tags'
                            items={tags.list.filter(t => t.idCategory == expense.idCategory)}
                            values={expense.idTags}
                            setValues={e => setExpense({ ...expense, idTags: e })}
                        />   
                        <DefaultBtn 
                            icon={ICONS.add}
                            width='50px'
                            onClick={() => setTagMode(true)}
                            disabled={!expense.idCategory}
                        />
                    </div>
                </div>
                : <div className='flex flex-col gap-2'>
                    {categoryMode && <>
                        <div className='flex gap-1'>
                            <TextInput placeholder='Nome da categoria' 
                                value={newCategory.name}
                                setValue={e => setNewCategory({ ...newCategory, name: e })}
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
                                text='Salvar categoria'
                                icon={ICONS.check}
                                width='170px'
                                onClick={handleNewCategory}
                            />
                        </div>
                    </>}
                    {tagMode && <>
                        <div className='flex gap-1'>
                            <TextInput placeholder='Nome da tag' 
                                value={newTag.name}
                                setValue={e => setNewTag({ ...newTag, name: e })}
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
                                text='Salvar tag'
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