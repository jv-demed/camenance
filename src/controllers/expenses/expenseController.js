import { insertRecord } from '@/supabase/crud';

export async function insertExpense(expense) {
    treatmentExpense(expense);
    const message = await validateExpense(expense);
    if(message){
        return message;
    }
    await insertRecord({
        table: 'camenance-expenses',
        obj: expense
    });
}

function treatmentExpense(expense) {
    if(expense?.title) {
        expense.title = expense.title.trim();
    } if(expense?.amount) {
        expense.amount = parseFloat(expense.amount);
    } if(expense?.description) {
        expense.description = expense.description.trim();
        expense.description = expense.description.charAt(0).toUpperCase() + 
                            expense.description.slice(1);
    }
}

async function validateExpense(expense) {
    if(!expense.title) {
        return 'O gasto precisa de um título.';
    } if(!expense.amount || isNaN(expense.amount) || expense.amount <= 0) {
        return 'O gasto precisa de um valor válido.';
    } if(!expense.idRecipient) {
        return 'O gasto precisa de um destinatário.';
    } if(!expense.idCategory) {
        return 'O gasto precisa de uma categoria.';
    }
}