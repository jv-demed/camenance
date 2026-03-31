import { TableNames } from '@/assets/TableNames';
import { InstallmentPurchaseModel } from '@/models/InstallmentPurchaseModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class InstallmentPurchaseRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.INSTALLMENT_PURCHASES, InstallmentPurchaseModel);
    }
}

export const installmentPurchaseRepository = new InstallmentPurchaseRepositoryClass();
