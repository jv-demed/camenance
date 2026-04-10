'use client'
import { useState, useEffect, useRef } from 'react';
import { OmdbService } from '@/services/OmdbService';
import { MovieModel } from '@/models/MovieModel';
import { movieRepository } from '@/repositories/MovieRepository';
import { MovieStatus } from '@/enums/MovieStatus';
import { AlertService } from '@/services/AlertService';
import { StarRating } from '@/screens/movies/StarRating';
import { ICONS } from '@/assets/icons';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { MdCheck, MdOutlineWatchLater } from 'react-icons/md';

function useDebounce(value, delay) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}

const STEP = { SEARCH: 'search', DETAIL: 'detail', RATE: 'rate' };

export function AddMovieModal({ isOpen, onClose, user, moviesRefresh, existingImdbIds }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const [step, setStep] = useState(STEP.SEARCH);
    const [selected, setSelected] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // Rating form
    const [rating, setRating] = useState(0);
    const [watchedAt, setWatchedAt] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const inputRef = useRef(null);
    const debouncedQuery = useDebounce(query, 400);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setStep(STEP.SEARCH);
            setSelected(null);
            setRating(0);
            setWatchedAt('');
            setNotes('');
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    useEffect(() => {
        if (!debouncedQuery || debouncedQuery.trim().length < 2) {
            setResults([]);
            return;
        }
        setSearching(true);
        OmdbService.search(debouncedQuery)
            .then(setResults)
            .finally(() => setSearching(false));
    }, [debouncedQuery]);

    async function handleSelectMovie(movie) {
        setLoadingDetail(true);
        setStep(STEP.DETAIL);
        const details = await OmdbService.getDetails(movie.imdbId);
        setSelected(details ?? movie);
        setLoadingDetail(false);
    }

    async function saveToWatchlist() {
        setSaving(true);
        try {
            const model = new MovieModel({ ...selected, userId: user.id, status: MovieStatus.WATCHLIST });
            await movieRepository.insert(model);
            moviesRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function saveAsWatched() {
        setSaving(true);
        try {
            const model = new MovieModel({
                ...selected,
                userId: user.id,
                status: MovieStatus.WATCHED,
                rating: rating || null,
                watchedAt: watchedAt || null,
                notes: notes || null,
            });
            await movieRepository.insert(model);
            moviesRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setSaving(false);
        }
    }

    if (!isOpen) return null;

    const alreadyAdded = selected && existingImdbIds.includes(selected.imdbId);

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh] shadow-xl'>

                {/* Header */}
                <header className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <div className='flex items-center gap-2'>
                        {step !== STEP.SEARCH && (
                            <button
                                onClick={() => { setStep(STEP.SEARCH); setSelected(null); }}
                                className='text-gray-400 hover:text-gray-600 transition-colors mr-1'
                            >
                                <ICONS.arrowLeft />
                            </button>
                        )}
                        <h2 className='font-semibold text-gray-800'>
                            {step === STEP.SEARCH && 'Adicionar filme'}
                            {step === STEP.DETAIL && 'Detalhes do filme'}
                            {step === STEP.RATE && 'Registrar como assistido'}
                        </h2>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-700 transition-colors text-xl'>
                        <ICONS.close />
                    </button>
                </header>

                <div className='px-6 py-5 overflow-y-auto flex flex-col gap-4'>

                    {/* STEP: SEARCH */}
                    {step === STEP.SEARCH && (
                        <>
                            <div className='relative'>
                                <input
                                    ref={inputRef}
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder='Buscar filme...'
                                    className='w-full px-4 py-2.5 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 pr-10'
                                />
                                <div className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                    {searching ? (
                                        <ICONS.spinLoader className='animate-spin text-primary' />
                                    ) : (
                                        <ICONS.search />
                                    )}
                                </div>
                            </div>

                            {results.length > 0 && (
                                <div className='flex flex-col gap-1'>
                                    {results.map(movie => (
                                        <button
                                            key={movie.imdbId}
                                            onClick={() => handleSelectMovie(movie)}
                                            className='flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors text-left w-full'
                                        >
                                            <div className='w-8 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0'>
                                                {movie.posterUrl ? (
                                                    <img src={movie.posterUrl} alt={movie.title} className='w-full h-full object-cover' />
                                                ) : (
                                                    <div className='w-full h-full flex items-center justify-center text-gray-300'>
                                                        <ICONS.movies className='text-sm' />
                                                    </div>
                                                )}
                                            </div>
                                            <div className='flex flex-col min-w-0'>
                                                <span className='text-sm font-medium text-gray-800 truncate'>{movie.title}</span>
                                                {movie.releaseYear && (
                                                    <span className='text-xs text-gray-400'>{movie.releaseYear}</span>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {debouncedQuery.length >= 2 && !searching && results.length === 0 && (
                                <p className='text-sm text-gray-400 text-center py-4'>Nenhum resultado encontrado.</p>
                            )}
                        </>
                    )}

                    {/* STEP: DETAIL */}
                    {step === STEP.DETAIL && (
                        <>
                            {loadingDetail ? (
                                <div className='py-8'><SpinLoader /></div>
                            ) : selected && (
                                <>
                                    {alreadyAdded && (
                                        <div className='bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-2 rounded-lg'>
                                            Este filme já está na sua lista.
                                        </div>
                                    )}

                                    <div className='flex gap-4'>
                                        {selected.posterUrl && (
                                            <img
                                                src={selected.posterUrl}
                                                alt={selected.title}
                                                className='w-24 rounded-xl object-cover flex-shrink-0'
                                            />
                                        )}
                                        <div className='flex flex-col gap-1.5 flex-1 min-w-0'>
                                            <div className='flex flex-col gap-1'>
                                                <input
                                                    value={selected.title}
                                                    onChange={e => setSelected({ ...selected, title: e.target.value })}
                                                    className='font-semibold text-gray-800 leading-tight text-sm border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors pb-0.5 bg-transparent w-full'
                                                />
                                                {selected.originalTitle && selected.originalTitle !== selected.title && (
                                                    <span className='text-[10px] text-gray-400 truncate'>{selected.originalTitle}</span>
                                                )}
                                            </div>
                                            <div className='flex flex-wrap gap-1.5 text-xs text-gray-400'>
                                                {selected.releaseYear && <span>{selected.releaseYear}</span>}
                                                {selected.runtimeMinutes && <span>· {selected.runtimeMinutes} min</span>}
                                                {selected.imdbRating && <span>· IMDb {selected.imdbRating}</span>}
                                            </div>
                                            {selected.genres?.length > 0 && (
                                                <div className='flex flex-wrap gap-1'>
                                                    {selected.genres.map(g => (
                                                        <span key={g} className='text-[10px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded-full'>
                                                            {g}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {selected.overview && (
                                        <p className='text-xs text-gray-500 leading-relaxed'>{selected.overview}</p>
                                    )}

                                    {!alreadyAdded && (
                                        <div className='flex gap-2 pt-2'>
                                            <button
                                                onClick={saveToWatchlist}
                                                disabled={saving}
                                                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors'
                                            >
                                                <MdOutlineWatchLater className='text-base' />
                                                Salvar para depois
                                            </button>
                                            <button
                                                onClick={() => setStep(STEP.RATE)}
                                                disabled={saving}
                                                className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors'
                                            >
                                                <MdCheck className='text-base' />
                                                Já assisti
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}

                    {/* STEP: RATE */}
                    {step === STEP.RATE && (
                        <div className='flex flex-col gap-4'>
                            <div className='flex flex-col gap-1.5'>
                                <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Sua nota</span>
                                <StarRating value={rating} onChange={setRating} size='lg' />
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Quando assistiu <span className='lowercase font-normal text-[10px] ml-1'>(opcional)</span></span>
                                <input
                                    type='date'
                                    value={watchedAt}
                                    onChange={e => setWatchedAt(e.target.value)}
                                    className='w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30'
                                />
                            </div>

                            <div className='flex flex-col gap-1.5'>
                                <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Observações <span className='lowercase font-normal text-[10px] ml-1'>(opcional)</span></span>
                                <textarea
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    placeholder='O que achou do filme?'
                                    rows={3}
                                    className='w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none'
                                />
                            </div>

                            <button
                                onClick={saveAsWatched}
                                disabled={saving}
                                className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60'
                            >
                                <MdCheck className='text-base' />
                                Salvar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
