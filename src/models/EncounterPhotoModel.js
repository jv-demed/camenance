import { BaseModel } from '@/models/BaseModel';

export class EncounterPhotoModel extends BaseModel {

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        userId: 'user_id',
        encounterId: 'encounter_id',
        bucket: 'bucket',
        path: 'path',
    };

}
