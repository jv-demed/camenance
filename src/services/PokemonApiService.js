const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const MAX_POKEDEX_ID = 151; // Geração 1

export class PokemonApiService {

    static async fetchById(pokedexId) {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${pokedexId}`);
        if (!response.ok) throw new Error(`Pokémon #${pokedexId} não encontrado`);
        const data = await response.json();
        return this.#parse(data);
    }

    static async fetchRandom() {
        const MAX_ATTEMPTS = 10;
        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const pokedexId = Math.floor(Math.random() * MAX_POKEDEX_ID) + 1;
            const [pokemon, isBase] = await Promise.all([
                this.fetchById(pokedexId),
                this.#isBasePokemon(pokedexId),
            ]);
            if (isBase) return pokemon;
        }
        return null;
    }

    static async #isBasePokemon(pokedexId) {
        const response = await fetch(`${POKEAPI_BASE_URL}/pokemon-species/${pokedexId}`);
        if (!response.ok) return false;
        const data = await response.json();
        return data.evolves_from_species === null;
    }

    static rollEncounter(chance = 10) {
        return Math.floor(Math.random() * chance) === 0;
    }

    static #parse(data) {
        return {
            pokedex: data.id,
            species: data.name,
            spriteUrl: data.sprites.other['official-artwork'].front_default ?? data.sprites.front_default,
            types: data.types.map(t => t.type.name),
            baseStats: {
                hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat,
                attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat,
                defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat,
                speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat,
            },
        };
    }

}
