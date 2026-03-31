import { BaseModel } from '@/models/BaseModel';

export class InstallmentPurchaseModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        description: 'description',
        totalAmount: 'total_amount',
        installmentTotal: 'installment_total',
        creditCardId: 'credit_card_id',
        payeeId: 'payee_id',
        categoryId: 'category_id',
        tagIds: 'tag_ids',
        startDate: 'start_date'
    };

}
