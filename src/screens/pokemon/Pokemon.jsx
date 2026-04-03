import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { pokemonRepository } from '@/repositories/PokemonRepository';
import { PokemonApiService } from '@/services/PokemonApiService';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { PokemonEncounter } from '@/screens/pokemon/PokemonEncounter';

export function Pokemon() {
    const { user } = useUser();

    const myPokemons = useDataList({
        repository: pokemonRepository,
        order: { column: 'capturedAt', ascending: false },
        filters: { userId: user.id },
    });

    const [phase, setPhase] = useState('rolling'); // rolling | encounter | idle
    const [wildPokemon, setWildPokemon] = useState(null);
    const [capturing, setCapturing] = useState(false);

    useEffect(() => {
        async function checkEncounter() {
            if (!PokemonApiService.rollEncounter()) {
                setPhase('idle');
                return;
            }
            try {
                const pokemon = await PokemonApiService.fetchRandom();
                if (!pokemon) {
                    setPhase('idle');
                    return;
                }
                setWildPokemon(pokemon);
                setPhase('encounter');
            } catch {
                setPhase('idle');
            }
        }
        checkEncounter();
    }, []);

    async function handleCapture() {
        if (!wildPokemon) return;
        setCapturing(true);
        try {
            await pokemonRepository.insert({
                userId: user.id,
                pokedex: wildPokemon.pokedex,
                species: wildPokemon.species,
                nickname: null,
                level: 1,
                xp: 0,
                capturedAt: new Date().toISOString(),
            });
            await myPokemons.refresh();
            setPhase('idle');
            setWildPokemon(null);
        } finally {
            setCapturing(false);
        }
    }

    function handleFlee() {
        setPhase('idle');
        setWildPokemon(null);
    }

    const isLoading = phase === 'rolling' || myPokemons.loading;

    return (
        <Main>
            <div className="flex flex-col gap-2 w-full h-screen max-h-screen overflow-hidden">
                <PageHeader title="Pokémon" />

                {isLoading ? (
                    <SpinLoader />
                ) : phase === 'encounter' ? (
                    <PokemonEncounter
                        pokemon={wildPokemon}
                        capturing={capturing}
                        onCapture={handleCapture}
                        onFlee={handleFlee}
                    />
                ) : (
                    <div className="flex flex-col gap-4 flex-1 overflow-y-auto pt-2">
                        {myPokemons.list.length === 0 ? (
                            <div className="flex flex-col items-center justify-center flex-1 gap-2 text-gray-400">
                                <p className="text-lg">Nenhum Pokémon capturado ainda.</p>
                                <p className="text-sm">Entre na página novamente para encontrar um!</p>
                            </div>
                        ) : (
                            <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {myPokemons.list.map(p => (
                                    <li key={p.id} className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-2">
                                        <img
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${p.pokedex}.png`}
                                            alt={p.species}
                                            className="w-20 h-20 object-contain"
                                        />
                                        <p className="capitalize font-medium text-gray-700">{p.nickname ?? p.species}</p>
                                        <p className="text-xs text-gray-400">Nível {p.level}</p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </Main>
    );
}
