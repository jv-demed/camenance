import { TableNames } from '@/assets/TableNames';
import { ExpenseTagModel } from '@/models/ExpenseTagModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class ExpenseTagRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.EXPENSE_TAGS, ExpenseTagModel);
    }
}

export const expenseTagRepository = new ExpenseTagRepositoryClass();