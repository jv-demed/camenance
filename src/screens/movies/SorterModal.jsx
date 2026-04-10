'use client'
import { useMemo, useState } from 'react';
import { MovieService } from '@/services/MovieService';
import { ICONS } from '@/assets/icons';
import { MdShuffle } from 'react-icons/md';

export function SorterModal({ isOpen, onClose, watchlist }) {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [result, setResult] = useState(null);
    const [spinning, setSpinning] = useState(false);

    const availableGenres = useMemo(
        () => MovieService.getAvailableGenres(watchlist),
        [watchlist]
    );

    function toggleGenre(genre) {
        setSelectedGenres(prev =>
            prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
        );
        setResult(null);
    }

    function handleSortear() {
        const filtered = MovieService.filterByGenres(watchlist, selectedGenres);
        if (!filtered.length) return;

        setSpinning(true);
        setResult(null);

        // Pequena animação de suspense
        setTimeout(() => {
            setResult(MovieService.pickRandom(filtered));
            setSpinning(false);
        }, 600);
    }

    function handleClose() {
        setSelectedGenres([]);
        setResult(null);
        onClose();
    }

    const filtered = MovieService.filterByGenres(watchlist, selectedGenres);
    const noResults = selectedGenres.length > 0 && filtered.length === 0;

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh] shadow-xl'>

                {/* Header */}
                <header className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <h2 className='font-semibold text-gray-800'>Sortear filme</h2>
                    <button onClick={handleClose} className='text-gray-400 hover:text-gray-700 transition-colors text-xl'>
                        <ICONS.close />
                    </button>
                </header>

                <div className='px-6 py-5 flex flex-col gap-5 overflow-y-auto'>

                    {/* Filtro de gêneros */}
                    {availableGenres.length > 0 && (
                        <div className='flex flex-col gap-2'>
                            <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
                                Filtrar por gênero <span className='lowercase font-normal text-[10px] ml-1'>(opcional)</span>
                            </span>
                            <div className='flex flex-wrap gap-1.5'>
                                {availableGenres.map(genre => (
                                    <button
                                        key={genre}
                                        onClick={() => toggleGenre(genre)}
                                        className={`
                                            px-3 py-1 rounded-full text-xs font-medium transition-all
                                            ${selectedGenres.includes(genre)
                                                ? 'bg-primary text-white'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        {genre}
                                    </button>
                                ))}
                            </div>
                            {selectedGenres.length > 0 && (
                                <span className='text-xs text-gray-400'>
                                    {noResults
                                        ? 'Nenhum filme com esses gêneros na lista.'
                                        : `${filtered.length} filme${filtered.length !== 1 ? 's' : ''} elegível${filtered.length !== 1 ? 'is' : ''}`
                                    }
                                </span>
                            )}
                        </div>
                    )}

                    {/* Resultado */}
                    {result && !spinning && (
                        <div className='flex gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100'>
                            {result.posterUrl && (
                                <img
                                    src={result.posterUrl}
                                    alt={result.title}
                                    className='w-16 h-24 rounded-lg object-cover flex-shrink-0'
                                />
                            )}
                            <div className='flex flex-col gap-1.5 justify-center'>
                                <p className='text-xs text-primary font-medium uppercase tracking-wide'>Sorteado!</p>
                                <p className='font-semibold text-gray-800 leading-tight'>{result.title}</p>
                                <div className='flex flex-wrap gap-1.5 text-xs text-gray-400'>
                                    {result.releaseYear && <span>{result.releaseYear}</span>}
                                    {result.runtimeMinutes && <span>· {result.runtimeMinutes} min</span>}
                                </div>
                                {result.genres?.length > 0 && (
                                    <div className='flex flex-wrap gap-1'>
                                        {result.genres.map(g => (
                                            <span key={g} className='text-[10px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full'>
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Botão sortear */}
                    <button
                        onClick={handleSortear}
                        disabled={spinning || noResults}
                        className='w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60'
                    >
                        <MdShuffle className={`text-lg ${spinning ? 'animate-spin' : ''}`} />
                        {spinning ? 'Sorteando...' : result ? 'Sortear novamente' : 'Sortear'}
                    </button>
                </div>
            </div>
        </div>
    );
}
