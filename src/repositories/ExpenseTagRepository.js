import { TableNames } from '@/assets/TableNames';
import { ExpenseTagModel } from '@/models/ExpenseTagModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class ExpenseTagRepository extends BaseRepository {
    constructor() {
        super(TableNames.EXPENSE_TAGS, ExpenseTagModel);
    }
}