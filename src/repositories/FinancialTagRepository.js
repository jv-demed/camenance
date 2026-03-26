import { TableNames } from '@/assets/TableNames';
import { FinancialTagModel } from '@/models/FinancialTagModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class FinancialTagRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.FINANCIAL_TAGS, FinancialTagModel);
    }
}

export const financialTagRepository = new FinancialTagRepositoryClass();
