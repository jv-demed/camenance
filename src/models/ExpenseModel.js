import { BaseModel } from '@/models/BaseModel';

export class ExpenseModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        description: 'description',
        amount: 'amount',
        payeeId: 'payee_id',
        categoryId: 'category_id',
        tagIds: 'tag_ids',
        date: 'date'
    };

}