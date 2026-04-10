'use client'
import { MovieCard } from '@/screens/movies/MovieCard';
import { ICONS } from '@/assets/icons';

export function WatchedList({ movies, onEdit }) {
    if (movies.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full gap-3 text-gray-400'>
                <ICONS.movies className='text-5xl opacity-30' />
                <p className='text-sm'>Nenhum filme assistido ainda.</p>
            </div>
        );
    }

    return (
        <div className='h-full overflow-y-auto pr-2'>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} onEdit={onEdit} />
                ))}
            </div>
        </div>
    );
}
