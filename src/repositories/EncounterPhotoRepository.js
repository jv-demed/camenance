import { TableNames } from '@/assets/TableNames';
import { EncounterPhotoModel } from '@/models/EncounterPhotoModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class EncounterPhotoRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.ENCOUNTER_PHOTOS, EncounterPhotoModel);
    }
}

export const encounterPhotoRepository = new EncounterPhotoRepositoryClass();
