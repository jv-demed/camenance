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
        date: 'date',
        paymentType: 'payment_type',
        creditCardId: 'credit_card_id',
        installmentGroupId: 'installment_group_id',
        installmentNumber: 'installment_number',
        installmentTotal: 'installment_total',
        dueDate: 'due_date'
    };

}