import { BaseModel } from '@/models/BaseModel';

export class ExpenseCategoryModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        color: 'color'
    };

}