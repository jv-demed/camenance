import { supabase } from '@/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export class Crud {

    static async generateId(table){
        const { data, error } = await supabase
            .rpc('generate_id', { table_name: table });
        if(error) throw error;
        return data || 1000;
    }

    static async insert(table, obj) {
        const { data, error } = await supabase
            .from(table)
            .insert(obj)
            .select()
            .single();
        if(error) throw error;
        return data;
    }

    static async findById(table, id) {
        const { data, error } = await supabase
            .from(table)
            .select('*')
            .eq('id', id)
            .single();
        if(error) throw error;
        return data;
    }

    static async findAll(table, filters = {}) {
        let query = supabase.from(table).select('*');
        for(const key in filters) {
            query = query.eq(key, filters[key]);
        }
        const { data, error } = await query;
        if(error) throw error;
        return data;
    }

    static async update(table, id, obj) {
        const { data, error } = await supabase
            .from(table)
            .update(obj)
            .eq('id', id)
            .select()
            .single();
        if(error) throw error;
        return data;
    }

    static async delete(table, id) {
        const { error } = await supabase
            .from(table)
            .delete()
            .eq('id', id);
        if(error) throw error;
        return true;
    }

}

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