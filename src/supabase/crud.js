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

    static async findAll(table, filters = {}, order = null, dateRange = null) {
        let query = supabase.from(table).select('*');
        for(const key in filters) {
            query = query.eq(key, filters[key]);
        }
        if(dateRange?.startDate) {
            query = query.gte('date', dateRange.startDate.toISOString().split('T')[0]);
        }
        if(dateRange?.endDate) {
            query = query.lte('date', dateRange.endDate.toISOString().split('T')[0]);
        }
        if(order) {
            query = query.order(order.column, { ascending: order.ascending ?? true });
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
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(where, value)
        .order(order, { ascending: ascending });
    if(error) throw error;
    return data;
}

export async function getRecordByFilter({
    table,
    select,
    where = 'id',
    value
}){
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq(where, value);
    if(error) throw error;
    return data.length > 0 ? data[0] : null;
}

export async function insertRecord({ table, obj }){
    const id = uuidv4();
    const { error } = await supabase
        .from(table)
        .insert({ ...obj, id });
    if(error) throw error;
    return id;
}