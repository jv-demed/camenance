const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com';

function parseGenres(genreStr) {
    if (!genreStr || genreStr === 'N/A') return [];
    return genreStr.split(',').map(g => g.trim());
}

function parseRuntime(runtimeStr) {
    if (!runtimeStr || runtimeStr === 'N/A') return null;
    const match = runtimeStr.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
}

function parseYear(yearStr) {
    if (!yearStr || yearStr === 'N/A') return null;
    return parseInt(yearStr);
}

function parseRating(ratingStr) {
    if (!ratingStr || ratingStr === 'N/A') return null;
    return parseFloat(ratingStr);
}

function mapDetails(raw) {
    return {
        imdbId: raw.imdbID,
        title: raw.Title,
        originalTitle: raw.Title,
        posterUrl: raw.Poster !== 'N/A' ? raw.Poster : null,
        overview: raw.Plot !== 'N/A' ? raw.Plot : null,
        releaseYear: parseYear(raw.Year),
        runtimeMinutes: parseRuntime(raw.Runtime),
        genres: parseGenres(raw.Genre),
        imdbRating: parseRating(raw.imdbRating),
    };
}

export const OmdbService = {

    async search(query) {
        if (!query || query.trim().length < 2) return [];
        const res = await fetch(
            `${BASE_URL}/?s=${encodeURIComponent(query)}&type=movie&apikey=${API_KEY}`
        );
        const data = await res.json();
        if (data.Response === 'False') return [];
        return (data.Search || []).map(raw => ({
            imdbId: raw.imdbID,
            title: raw.Title,
            posterUrl: raw.Poster !== 'N/A' ? raw.Poster : null,
            releaseYear: parseYear(raw.Year),
            genres: [],
        }));
    },

    async getDetails(imdbId) {
        const res = await fetch(
            `${BASE_URL}/?i=${imdbId}&plot=short&apikey=${API_KEY}`
        );
        const data = await res.json();
        if (data.Response === 'False') return null;
        return mapDetails(data);
    },

};
