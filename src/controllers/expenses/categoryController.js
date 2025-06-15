import { insertRecord } from "@/supabase/crud";

export async function insertCategory(category) {
    await insertRecord({
        table: 'camenance-expensesCategories',
        obj: category
    });
}