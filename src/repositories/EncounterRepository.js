import { TableNames } from '@/assets/TableNames';
import { EncounterModel } from '@/models/EncounterModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class EncounterRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.ENCOUNTERS, EncounterModel);
    }
}

export const encounterRepository = new EncounterRepositoryClass();
