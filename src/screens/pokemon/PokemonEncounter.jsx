const TYPE_COLORS = {
    fire: 'bg-orange-100 text-orange-700',
    water: 'bg-blue-100 text-blue-700',
    grass: 'bg-green-100 text-green-700',
    electric: 'bg-yellow-100 text-yellow-700',
    psychic: 'bg-pink-100 text-pink-700',
    ice: 'bg-cyan-100 text-cyan-700',
    dragon: 'bg-indigo-100 text-indigo-700',
    dark: 'bg-gray-200 text-gray-700',
    fairy: 'bg-rose-100 text-rose-600',
    fighting: 'bg-red-100 text-red-700',
    poison: 'bg-purple-100 text-purple-700',
    ground: 'bg-amber-100 text-amber-700',
    rock: 'bg-stone-100 text-stone-700',
    bug: 'bg-lime-100 text-lime-700',
    ghost: 'bg-violet-100 text-violet-700',
    steel: 'bg-slate-100 text-slate-700',
    normal: 'bg-zinc-100 text-zinc-600',
    flying: 'bg-sky-100 text-sky-700',
};

export function PokemonEncounter({ pokemon, capturing, onCapture, onFlee }) {
    return (
        <div className="flex flex-col items-center justify-center gap-6 flex-1">
            <p className="text-gray-500 text-sm tracking-wide uppercase">
                Um Pokémon selvagem apareceu!
            </p>

            <div className="flex flex-col items-center gap-3 bg-white rounded-2xl shadow-md p-8">
                <img
                    src={pokemon.spriteUrl}
                    alt={pokemon.species}
                    className="w-40 h-40 object-contain"
                />
                <h2 className="text-2xl font-semibold capitalize text-gray-700">
                    {pokemon.species}
                </h2>
                <div className="flex gap-2">
                    {pokemon.types.map(type => (
                        <span
                            key={type}
                            className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${TYPE_COLORS[type] ?? 'bg-gray-100 text-gray-600'}`}
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={onCapture}
                    disabled={capturing}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                    {capturing ? 'Capturando...' : 'Capturar'}
                </button>
                <button
                    onClick={onFlee}
                    disabled={capturing}
                    className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition disabled:opacity-50"
                >
                    Fugir
                </button>
            </div>
        </div>
    );
}
