import { insertRecord } from '@/supabase/crud';

export const entryTypes = [
    {
        id: 0,
        name: 'Única',
    },{
        id: 1,
        name: 'Recorrente',
    },{
        id: 2,
        name: 'Proventos'
    }
];

export const expensesTypes = [
    {
        id: 0,
        name: 'Única',
    },{
        id: 1,
        name: 'Conta',
    },{
        id: 2,
        name: 'Parcelamento',
    }
];

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
        return `A ${expense.isEntry ? 'entrada' : 'saída'} precisa de um título.`;
    } if(!expense.amount || isNaN(expense.amount) || expense.amount <= 0) {
        return  `A ${expense.isEntry ? 'entrada' : 'saída'} precisa de um valor válido.`;
    } if(!expense.idOrigin) {
        return `A ${expense.isEntry ? 'entrada' : 'saída'} precisa de uma origem.`;
    } if(!expense.isEntry && !expense.idCategory) {
        return 'A saída precisa de uma categoria.';
    }
}