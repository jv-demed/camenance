import { TableNames } from '@/assets/TableNames';
import { CreditCardModel } from '@/models/CreditCardModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class CreditCardRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.CREDIT_CARDS, CreditCardModel);
    }
}

export const creditCardRepository = new CreditCardRepositoryClass();
