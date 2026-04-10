import { TableNames } from '@/assets/TableNames';
import { MovieModel } from '@/models/MovieModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class MovieRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.MOVIES, MovieModel);
    }
}

export const movieRepository = new MovieRepositoryClass();
