'use client'
import { useState, useEffect } from 'react';
import { movieRepository } from '@/repositories/MovieRepository';
import { MovieStatus } from '@/enums/MovieStatus';
import { AlertService } from '@/services/AlertService';
import { StarRating } from '@/screens/movies/StarRating';
import { ICONS } from '@/assets/icons';
import { MdCheck } from 'react-icons/md';

export function RateMovieModal({ movie, onClose, moviesRefresh }) {
    const [title, setTitle] = useState('');
    const [rating, setRating] = useState(0);
    const [watchedAt, setWatchedAt] = useState('');
    const [notes, setNotes] = useState('');
    const [saving, setSaving] = useState(false);

    const isEdit = movie?.status === MovieStatus.WATCHED;

    useEffect(() => {
        if (movie) {
            setTitle(movie.title ?? '');
            setRating(movie.rating ?? 0);
            setWatchedAt(movie.watchedAt ?? '');
            setNotes(movie.notes ?? '');
        }
    }, [movie]);

    if (!movie) return null;

    async function handleSave() {
        setSaving(true);
        try {
            await movieRepository.update(movie.id, {
                title: title || movie.title,
                status: MovieStatus.WATCHED,
                rating: rating || null,
                watchedAt: watchedAt || null,
                notes: notes || null,
            });
            moviesRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        const confirmed = await AlertService.confirm('Remover este filme?');
        if (!confirmed) return;
        try {
            await movieRepository.delete(movie.id);
            moviesRefresh?.();
            AlertService.fastSuccess();
            onClose();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
            <div className='bg-white rounded-2xl w-full max-w-md flex flex-col overflow-hidden max-h-[90vh] shadow-xl'>

                {/* Header */}
                <header className='flex items-center justify-between px-6 py-4 border-b border-border'>
                    <h2 className='font-semibold text-gray-800'>
                        {isEdit ? 'Editar avaliação' : 'Marcar como assistido'}
                    </h2>
                    <button onClick={onClose} className='text-gray-400 hover:text-gray-700 transition-colors text-xl'>
                        <ICONS.close />
                    </button>
                </header>

                <div className='px-6 py-5 flex flex-col gap-4 overflow-y-auto'>

                    {/* Movie info */}
                    <div className='flex gap-3 items-center'>
                        {movie.posterUrl && (
                            <img
                                src={movie.posterUrl}
                                alt={title}
                                className='w-12 h-16 rounded-lg object-cover flex-shrink-0'
                            />
                        )}
                        <div className='flex flex-col gap-1 flex-1 min-w-0'>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                className='font-semibold text-gray-800 text-sm leading-tight border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition-colors pb-0.5 bg-transparent w-full'
                            />
                            {movie.releaseYear && (
                                <p className='text-xs text-gray-400'>{movie.releaseYear}</p>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div className='flex flex-col gap-1.5'>
                        <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>Sua nota</span>
                        <StarRating value={rating} onChange={setRating} size='lg' />
                    </div>

                    {/* Watched at */}
                    <div className='flex flex-col gap-1.5'>
                        <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
                            Quando assistiu <span className='lowercase font-normal text-[10px] ml-1'>(opcional)</span>
                        </span>
                        <input
                            type='date'
                            value={watchedAt}
                            onChange={e => setWatchedAt(e.target.value)}
                            className='w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30'
                        />
                    </div>

                    {/* Notes */}
                    <div className='flex flex-col gap-1.5'>
                        <span className='text-xs font-medium text-gray-400 uppercase tracking-wide'>
                            Observações <span className='lowercase font-normal text-[10px] ml-1'>(opcional)</span>
                        </span>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder='O que achou do filme?'
                            rows={3}
                            className='w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none'
                        />
                    </div>

                    {/* Actions */}
                    <div className='flex gap-2 pt-1'>
                        <button
                            onClick={handleDelete}
                            className='p-2.5 rounded-xl border border-red-200 text-red-400 hover:bg-red-50 transition-colors'
                        >
                            <ICONS.trash />
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className='flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60'
                        >
                            <MdCheck className='text-base' />
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
