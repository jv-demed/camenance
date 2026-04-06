import { BaseModel } from '@/models/BaseModel';

export class LocationModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        name: 'name',
    };

}
