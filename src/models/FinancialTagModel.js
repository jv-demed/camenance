import { BaseModel } from '@/models/BaseModel';

export class FinancialTagModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        categoryId: 'category_id',
        title: 'title',
        color: 'color'
    };

}
