import { insertRecord } from '@/supabase/crud';

export async function insertOrigin(origin) {
    treatmentOrigin(origin);
    const message = validateOrigin(origin);
    if(message){
        return message;
    }
    return await insertRecord({
        table: 'camenance-expensesOrigins',
        obj: origin
    });
}

function treatmentOrigin(origin) {
    if(origin?.name) {
        origin.name = origin.name.trim();
        origin.name = origin.name.charAt(0).toUpperCase() + 
                        origin.name.slice(1);
    }
}

function validateOrigin(origin) {
    if(!origin.name) {
        return 'A origem precisa de um nome.';
    }
}