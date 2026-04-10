export const MovieService = {

    getAvailableGenres(movies) {
        const set = new Set();
        movies.forEach(m => (m.genres || []).forEach(g => set.add(g)));
        return [...set].sort();
    },

    filterByGenres(movies, genres) {
        if (!genres || genres.length === 0) return movies;
        return movies.filter(m =>
            genres.some(g => (m.genres || []).includes(g))
        );
    },

    pickRandom(movies) {
        if (!movies.length) return null;
        return movies[Math.floor(Math.random() * movies.length)];
    },

    sortWatched(movies) {
        return [...movies].sort((a, b) => {
            if (a.watchedAt && b.watchedAt) return b.watchedAt.localeCompare(a.watchedAt);
            if (a.watchedAt) return -1;
            if (b.watchedAt) return 1;
            return (b.addedAt ?? '').localeCompare(a.addedAt ?? '');
        });
    },

};
