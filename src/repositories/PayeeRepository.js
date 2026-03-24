import { TableNames } from '@/assets/TableNames';
import { PayeeModel } from '@/models/PayeeModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class PayeeRepository extends BaseRepository {
    constructor() {
        super(TableNames.PAYEES, PayeeModel);
    }
}