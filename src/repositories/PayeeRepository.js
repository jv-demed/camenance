import { TableNames } from '@/assets/TableNames';
import { PayeeModel } from '@/models/PayeeModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class PayeeRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.PAYEES, PayeeModel);
    }
}

export const payeeRepository = new PayeeRepositoryClass();