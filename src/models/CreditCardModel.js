import { BaseModel } from '@/models/BaseModel';

export class CreditCardModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        name: 'name',
        closingDay: 'closing_day',
        dueDay: 'due_day',
        color: 'color'
    };

}
