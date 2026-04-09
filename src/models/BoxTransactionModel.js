import { BaseModel } from '@/models/BaseModel';

export class BoxTransactionModel extends BaseModel {

    static TYPE = Object.freeze({
        DEPOSIT: 'deposit',
        WITHDRAW: 'withdraw',
        SPEND: 'spend',
        YIELD: 'yield',
    });

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        boxId: 'box_id',
        type: 'type',
        amount: 'amount',
        date: 'date',
        description: 'description',
        expenseId: 'expense_id',
        incomeId: 'income_id',
    };

}
