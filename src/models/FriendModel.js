import { BaseModel } from '@/models/BaseModel';

export class FriendModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        name: 'name',
        birthday: 'birthday',
        friendshipLevel: 'friendship_level',
        maintenance: 'maintenance',
    };

}
