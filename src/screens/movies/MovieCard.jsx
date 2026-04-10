'use client'
import { StarRating } from '@/screens/movies/StarRating';
import { ICONS } from '@/assets/icons';

export function MovieCard({ movie, onEdit }) {
    return (
        <div className='bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all group flex flex-col'>
            {/* Poster */}
            <div className='relative aspect-[2/3] bg-gray-100 overflow-hidden'>
                {movie.posterUrl ? (
                    <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center text-gray-300'>
                        <ICONS.movies className='text-4xl' />
                    </div>
                )}

                {/* Edit button on hover */}
                <button
                    onClick={() => onEdit(movie)}
                    className='absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-gray-500 hover:text-primary opacity-0 group-hover:opacity-100 transition-all shadow-sm'
                >
                    <ICONS.edit className='text-xs' />
                </button>

                {/* Rating badge */}
                {movie.rating && (
                    <div className='absolute bottom-2 left-2 bg-black/70 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1'>
                        ★ {movie.rating}/5
                    </div>
                )}
            </div>

            {/* Info */}
            <div className='p-2.5 flex flex-col gap-1.5 flex-1'>
                <span className='font-semibold text-gray-800 text-sm leading-tight line-clamp-2'>
                    {movie.title}
                </span>

                <div className='flex items-center gap-1.5 flex-wrap'>
                    {movie.releaseYear && (
                        <span className='text-xs text-gray-400'>{movie.releaseYear}</span>
                    )}
                    {movie.imdbRating && (
                        <span className='text-xs text-gray-400'>· IMDb {movie.imdbRating}</span>
                    )}
                </div>

                {/* Genres */}
                {movie.genres?.length > 0 && (
                    <div className='flex flex-wrap gap-1 mt-auto pt-1'>
                        {movie.genres.slice(0, 2).map(g => (
                            <span key={g} className='text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full'>
                                {g}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
