import { TableNames } from '@/assets/TableNames';
import { BaseRepository } from '@/repositories/BaseRepository';
import { ExpenseCategoryModel } from '@/models/ExpenseCategoryModel';

export class ExpenseCategoryRepository extends BaseRepository {
    constructor() {
        super(TableNames.EXPENSE_CATEGORIES, ExpenseCategoryModel);
    }
}