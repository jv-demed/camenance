import { supabase } from '@/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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

export async function getRecordByFilter({ 
    table, 
    select, 
    where = 'id', 
    value
}){
    const {data, status, error} = await supabase
        .from(table)
        .select(select)
        .eq(where, value);
    if(status != 200){
        console.log(error);
    }
    if(data.length > 0){
        return data[0];
    }
}

export async function insertRecord({ table, obj }){
    const id = uuidv4();
    const { status, error } = await supabase
        .from(table)
        .insert({
            ...obj,
            id: id
        });
    if(status != 201){
        console.log(error);
        return;
    } return id;
}