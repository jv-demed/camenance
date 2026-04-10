'use client'
import { useMemo, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { movieRepository } from '@/repositories/MovieRepository';
import { MovieService } from '@/services/MovieService';
import { MovieStatus } from '@/enums/MovieStatus';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ICONS } from '@/assets/icons';
import { WatchedList } from '@/screens/movies/WatchedList';
import { WatchlistMovies } from '@/screens/movies/WatchlistMovies';
import { AddMovieModal } from '@/screens/movies/AddMovieModal';
import { RateMovieModal } from '@/screens/movies/RateMovieModal';
import { SorterModal } from '@/screens/movies/SorterModal';
import { MdShuffle } from 'react-icons/md';

const TABS = [
    { key: 'watched', label: 'Assistidos' },
    { key: 'watchlist', label: 'Quero assistir' },
];

export function MoviesScreen() {

    const { user } = useUser();

    const movies = useDataList({
        repository: movieRepository,
        order: { column: 'addedAt', ascending: false },
        filters: { userId: user.id },
    });

    const watched = useMemo(
        () => MovieService.sortWatched(movies.list.filter(m => m.status === MovieStatus.WATCHED)),
        [movies.list]
    );

    const watchlist = useMemo(
        () => movies.list.filter(m => m.status === MovieStatus.WATCHLIST),
        [movies.list]
    );

    const [activeTab, setActiveTab] = useState('watched');

    // Modal: adicionar filme
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Modal: avaliar / marcar como assistido
    const [rateMovie, setRateMovie] = useState(null);

    // Modal: sorteador
    const [isSorterOpen, setIsSorterOpen] = useState(false);

    function openRate(movie) {
        setRateMovie(movie);
    }

    function closeRate() {
        setRateMovie(null);
    }

    return (
        <Main>
            {movies.loading ? <SpinLoader /> : (
                <div className='flex flex-col gap-3 w-full h-screen max-h-screen overflow-hidden'>
                    <PageHeader title='Filmes' />

                    {/* Abas e Ações */}
                    <div className='flex items-center justify-between border-b border-white/15 pb-2'>
                        <div className='flex gap-1'>
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        px-4 py-1.5 rounded-lg text-sm transition-all duration-200
                                        ${activeTab === tab.key
                                            ? 'bg-white text-gray-700 font-semibold shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {tab.label}
                                    <span className='ml-1.5 text-xs opacity-60'>
                                        {tab.key === 'watched' ? watched.length : watchlist.length}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className='flex items-center gap-2'>
                            {activeTab === 'watchlist' && watchlist.length > 0 && (
                                <button
                                    onClick={() => setIsSorterOpen(true)}
                                    className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-all'
                                >
                                    <MdShuffle className='text-base' />
                                    Sortear
                                </button>
                            )}
                            <DefaultBtn
                                text='Adicionar'
                                icon={ICONS.add}
                                width='140px'
                                onClick={() => setIsAddOpen(true)}
                            />
                        </div>
                    </div>

                    {/* Conteúdo */}
                    <div className='flex-1 overflow-hidden pb-4'>
                        {activeTab === 'watched' && (
                            <WatchedList movies={watched} onEdit={openRate} />
                        )}
                        {activeTab === 'watchlist' && (
                            <WatchlistMovies
                                movies={watchlist}
                                onMarkWatched={openRate}
                                moviesRefresh={movies.refresh}
                            />
                        )}
                    </div>
                </div>
            )}

            <AddMovieModal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                user={user}
                moviesRefresh={movies.refresh}
                existingImdbIds={movies.list.map(m => m.imdbId)}
            />

            <RateMovieModal
                movie={rateMovie}
                onClose={closeRate}
                moviesRefresh={movies.refresh}
            />

            <SorterModal
                isOpen={isSorterOpen}
                onClose={() => setIsSorterOpen(false)}
                watchlist={watchlist}
            />
        </Main>
    );
}
