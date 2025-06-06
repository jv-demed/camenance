import { supabase } from '@/supabase/client';

export async function insertRecord({ table, obj }){
    const { status, error } = await supabase
        .from(table)
        .insert(obj);
    if(status != 201){
        console.log(error);
    }
}