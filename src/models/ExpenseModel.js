import { BaseModel } from '@/models/BaseModel';

export class ExpenseModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        title: 'title',
        description: 'description',
        amount: 'amount'
    };

}