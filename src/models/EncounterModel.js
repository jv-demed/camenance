import { BaseModel } from '@/models/BaseModel';

export class EncounterModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        title: 'title',
        date: 'date',
        locationId: 'location_id',
        notes: 'notes',
        friendIds: 'friend_ids',
    };

}
