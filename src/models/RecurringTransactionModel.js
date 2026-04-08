import { BaseModel } from '@/models/BaseModel';

export class RecurringTransactionModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        description: 'description',
        amount: 'amount',
        type: 'type',
        paymentType: 'payment_type',
        incomeType: 'income_type',
        payeeId: 'payee_id',
        sourceId: 'source_id',
        categoryId: 'category_id',
        tagIds: 'tag_ids',
        frequency: 'frequency',
        startDate: 'start_date',
        dayOfWeek: 'day_of_week',
        dayOfMonth: 'day_of_month',
        creditCardId: 'credit_card_id',
        realizedDates: 'realized_dates',
        skippedDates: 'skipped_dates',
        benefitTypeId: 'benefit_type_id',
    };

}
