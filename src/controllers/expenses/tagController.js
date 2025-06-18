import { getRecordByFilter, insertRecord } from '@/supabase/crud';

export async function insertTag(tag) {
    treatmentTag(tag);
    const message = await validateTag(tag);
    if(message){
        return message;
    }
    await insertRecord({
        table: 'camenance-expensesTags',
        obj: tag
    });
}

function treatmentTag(tag) {
    if(tag?.name) {
        tag.name = tag.name.trim();
        tag.name = tag.name.charAt(0).toUpperCase() + 
                        tag.name.slice(1).toLowerCase();
    }
}

async function validateTag(tag) {
    if(!tag.name) {
        return 'A tag precisa de um nome.';
    }
    if(!tag.idCategory){
        return 'A tag necessita de uma categoria vinculada.'
    }
    const exists = await getRecordByFilter({
        table: 'camenance-expensesTags',
        select: 'name, idCategory',
        where: 'name',
        value: tag.name.trim()
    });
    if(exists && tag.idCategory == exists.idCategory){
        return `A tag "${tag.name}" já existe.`;
    }
}