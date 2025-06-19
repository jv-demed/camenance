import { insertRecord } from '@/supabase/crud';

export async function insertRecipient(recipient) {
    treatmentRecipient(recipient);
    const message = validateRecipient(recipient);
    if(message){
        return message;
    }
    return await insertRecord({
        table: 'camenance-expensesRecipients',
        obj: recipient
    });
}

function treatmentRecipient(recipient) {
    if(recipient?.name) {
        recipient.name = recipient.name.trim();
        recipient.name = recipient.name.charAt(0).toUpperCase() + 
                        recipient.name.slice(1);
    }
}

function validateRecipient(recipient) {
    if(!recipient.name) {
        return 'O destinatário precisa de um nome.';
    }
}