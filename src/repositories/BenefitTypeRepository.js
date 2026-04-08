import { TableNames } from '@/assets/TableNames';
import { BenefitTypeModel } from '@/models/BenefitTypeModel';
import { BaseRepository } from '@/repositories/BaseRepository';

class BenefitTypeRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.BENEFIT_TYPES, BenefitTypeModel);
    }
}

export const benefitTypeRepository = new BenefitTypeRepositoryClass();
