import { TableNames } from '@/assets/TableNames';
import { LocationModel } from '@/models/LocationModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class LocationRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.LOCATIONS, LocationModel);
    }
}

export const locationRepository = new LocationRepositoryClass();
