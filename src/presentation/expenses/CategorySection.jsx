import { useEffect, useState } from 'react';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SelectInput } from '@/components/inputs/SelectInput';
import { insertCategory } from '@/controllers/expenses/categoryController';
import { useUser } from '@/context/UserContext';

export function CategorySection({
    categories,
    value,
    setValue
}) {

    const { obj: user } = useUser();

    const [mode, setMode] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        color: ''
    });

    useEffect(() => {
        console.log(newCategory);
    }, [newCategory]);

    async function handleNewCategory() {
        await insertCategory({
            ...newCategory,
            idUser: user.id
        });
        categories.refresh();
    }

    return (
        <div>
            {!mode 
                ? <div className='flex gap-1'>
                    <SelectInput
                        items={categories.list}
                        value={value}
                        setValue={setValue}
                    />
                    <DefaultBtn 
                        icon={ICONS.add}
                        width='50px'
                        onClick={() => setMode(true)}
                    />
                </div>
                : <div className='flex flex-col gap-2'>
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
                            onClick={() => setMode(false)}
                        />
                        <DefaultBtn 
                            text='Salvar categoria'
                            icon={ICONS.check}
                            width='170px'
                            onClick={handleNewCategory}
                        />
                    </div>
                </div>
            }
        </div>
    )
}