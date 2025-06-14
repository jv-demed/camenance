import { supabase } from '@/supabase/client';

export async function getAllRecordsByFilter({ 
    table, 
    select, 
    where = 'id', 
    value,
    order = 'dateRegister',
    ascending = true
}){
    const {data, status, error} = await supabase
        .from(table)
        .select(select)
        .eq(where, value)
        .order(order, { ascending: ascending });
    if(status != 200){
        console.log(error);
    }return data;
}

export async function insertRecord({ table, obj }){
    const { status, error } = await supabase
        .from(table)
        .insert(obj);
    if(status != 201){
        console.log(error);
    }
}