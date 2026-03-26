import { TableNames } from '@/assets/TableNames';
import { BaseRepository } from '@/repositories/BaseRepository';
import { ExpenseCategoryModel } from '@/models/ExpenseCategoryModel';

class ExpenseCategoryRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.EXPENSE_CATEGORIES, ExpenseCategoryModel);
    }
}

export const expenseCategoryRepository = new ExpenseCategoryRepositoryClass();