import { getRecordByFilter, insertRecord } from '@/supabase/crud';

export async function insertCategory(category) {
    treatmentCategory(category);
    const message = await validateCategory(category);
    if(message){
        return message;
    }
    await insertRecord({
        table: 'camenance-expensesCategories',
        obj: category
    });
}

function treatmentCategory(category) {
    if(category?.name) {
        category.name = category.name.trim();
        category.name = category.name.charAt(0).toUpperCase() + 
                        category.name.slice(1).toLowerCase();
    }
}

async function validateCategory(category) {
    if(!category.name) {
        return 'A categoria precisa de um nome.';
    }
    const exists = await getRecordByFilter({
        table: 'camenance-expensesCategories',
        select: 'name',
        where: 'name',
        value: category.name.trim()
    });
    if(exists){
        return `A categoria "${category.name}" já existe.`;
    }
}