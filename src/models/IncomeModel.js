import { BaseModel } from '@/models/BaseModel';

export class IncomeModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        description: 'description',
        amount: 'amount',
        sourceId: 'source_id',
        incomeType: 'income_type',
        categoryId: 'category_id',
        tagIds: 'tag_ids',
        date: 'date',
        benefitTypeId: 'benefit_type_id'
    };

}
