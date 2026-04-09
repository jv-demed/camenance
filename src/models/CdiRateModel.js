import { BaseModel } from '@/models/BaseModel';

export class CdiRateModel extends BaseModel {

    static fields = {
        date: 'date',
        rate: 'rate',
        createdAt: 'created_at',
    };

}
