import { BaseModel } from '@/models/BaseModel';

export class MovieModel extends BaseModel {

    static fields = {
        id: 'id',
        userId: 'user_id',
        imdbId: 'imdb_id',
        title: 'title',
        originalTitle: 'original_title',
        posterUrl: 'poster_url',
        overview: 'overview',
        releaseYear: 'release_year',
        runtimeMinutes: 'runtime_minutes',
        genres: 'genres',
        imdbRating: 'imdb_rating',
        status: 'status',
        rating: 'rating',
        watchedAt: 'watched_at',
        notes: 'notes',
        addedAt: 'added_at',
        updatedAt: 'updated_at',
    };

}
