import { TableNames } from '@/assets/TableNames';
import { BoxModel } from '@/models/BoxModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class BoxRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.BOXES, BoxModel);
    }
}

export const boxRepository = new BoxRepositoryClass();
