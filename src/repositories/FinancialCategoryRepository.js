import { TableNames } from '@/assets/TableNames';
import { BaseRepository } from '@/repositories/BaseRepository';
import { FinancialCategoryModel } from '@/models/FinancialCategoryModel';

class FinancialCategoryRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.FINANCIAL_CATEGORIES, FinancialCategoryModel);
    }
}

export const financialCategoryRepository = new FinancialCategoryRepositoryClass();
