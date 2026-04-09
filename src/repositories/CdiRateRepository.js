import { TableNames } from '@/assets/TableNames';
import { CdiRateModel } from '@/models/CdiRateModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class CdiRateRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.CDI_RATES, CdiRateModel);
    }
}

export const cdiRateRepository = new CdiRateRepositoryClass();
