import { BaseModel } from '@/models/BaseModel';

export class BoxModel extends BaseModel {

    static TYPE = Object.freeze({
        SIMPLE: 'simple',
        NUBANK: 'nubank',
    });

    static fields = {
        id: 'id',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        userId: 'user_id',
        name: 'name',
        description: 'description',
        color: 'color',
        icon: 'icon',
        type: 'type',
        cdiPercentage: 'cdi_percentage',
    };

}
