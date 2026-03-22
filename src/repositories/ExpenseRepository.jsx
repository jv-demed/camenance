import { TableNames } from '@/assets/TableNames';
import { ExpenseModel } from '@/models/ExpenseModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class ExpenseRepository extends BaseRepository {
    constructor() {
        super(TableNames.EXPENSES, ExpenseModel);
    }
}