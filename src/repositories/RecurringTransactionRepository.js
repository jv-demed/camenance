import { TableNames } from '@/assets/TableNames';
import { RecurringTransactionModel } from '@/models/RecurringTransactionModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class RecurringTransactionRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.RECURRING_TRANSACTIONS, RecurringTransactionModel);
    }
}

export const recurringTransactionRepository = new RecurringTransactionRepositoryClass();
