import { TableNames } from '@/assets/TableNames';
import { EncounterPhotoModel } from '@/models/EncounterPhotoModel';
import { BaseRepository } from '@/repositories/BaseRepository';
import { StorageService } from '@/services/StorageService';

export class EncounterPhotoRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.ENCOUNTER_PHOTOS, EncounterPhotoModel);
    }

    async delete(id) {
        const photo = await this.findById(id);
        if (photo?.bucket && photo?.path) {
            await StorageService.remove(photo.bucket, photo.path);
        }
        return super.delete(id);
    }
}

export const encounterPhotoRepository = new EncounterPhotoRepositoryClass();
