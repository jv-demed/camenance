import { TableNames } from '@/assets/TableNames';
import { IncomeModel } from '@/models/IncomeModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class IncomeRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.INCOMES, IncomeModel);
    }
}

export const incomeRepository = new IncomeRepositoryClass();
