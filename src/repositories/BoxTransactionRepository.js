import { TableNames } from '@/assets/TableNames';
import { BoxTransactionModel } from '@/models/BoxTransactionModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class BoxTransactionRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.BOX_TRANSACTIONS, BoxTransactionModel);
    }
}

export const boxTransactionRepository = new BoxTransactionRepositoryClass();
