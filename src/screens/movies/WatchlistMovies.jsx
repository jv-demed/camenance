'use client'
import { movieRepository } from '@/repositories/MovieRepository';
import { MovieStatus } from '@/enums/MovieStatus';
import { AlertService } from '@/services/AlertService';
import { ICONS } from '@/assets/icons';
import { MdOutlineWatchLater, MdCheck } from 'react-icons/md';

export function WatchlistMovies({ movies, onMarkWatched, moviesRefresh }) {

    async function handleRemove(movie) {
        const confirmed = await AlertService.confirm('Remover da lista?');
        if (!confirmed) return;
        try {
            await movieRepository.delete(movie.id);
            moviesRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    if (movies.length === 0) {
        return (
            <div className='flex flex-col items-center justify-center h-full gap-3 text-gray-400'>
                <MdOutlineWatchLater className='text-5xl opacity-30' />
                <p className='text-sm'>Sua lista está vazia. Adicione filmes!</p>
            </div>
        );
    }

    return (
        <div className='h-full overflow-y-auto pr-2'>
            <div className='flex flex-col gap-2'>
                {movies.map(movie => (
                    <div
                        key={movie.id}
                        className='bg-white rounded-xl border border-gray-200 px-3 py-3 flex items-center gap-3 hover:shadow-sm hover:border-gray-300 transition-all group'
                    >
                        {/* Poster */}
                        <div className='w-10 h-14 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0'>
                            {movie.posterUrl ? (
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className='w-full h-full object-cover'
                                />
                            ) : (
                                <div className='w-full h-full flex items-center justify-center text-gray-300'>
                                    <ICONS.movies className='text-lg' />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className='flex flex-col gap-1 flex-1 min-w-0'>
                            <span className='font-semibold text-gray-800 text-sm truncate'>{movie.title}</span>
                            <div className='flex items-center gap-1.5 flex-wrap'>
                                {movie.releaseYear && (
                                    <span className='text-xs text-gray-400'>{movie.releaseYear}</span>
                                )}
                                {movie.runtimeMinutes && (
                                    <span className='text-xs text-gray-400'>· {movie.runtimeMinutes} min</span>
                                )}
                            </div>
                            {movie.genres?.length > 0 && (
                                <div className='flex flex-wrap gap-1'>
                                    {movie.genres.slice(0, 3).map(g => (
                                        <span key={g} className='text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full'>
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0'>
                            <button
                                onClick={() => onMarkWatched(movie)}
                                title='Marcar como assistido'
                                className='flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors'
                            >
                                <MdCheck className='text-sm' />
                                Assisti
                            </button>
                            <button
                                onClick={() => handleRemove(movie)}
                                title='Remover da lista'
                                className='p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors'
                            >
                                <ICONS.trash className='text-sm' />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
