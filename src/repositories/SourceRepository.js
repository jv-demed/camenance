import { TableNames } from '@/assets/TableNames';
import { SourceModel } from '@/models/SourceModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class SourceRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.SOURCES, SourceModel);
    }
}

export const sourceRepository = new SourceRepositoryClass();
