import { TableNames } from '@/assets/TableNames';
import { PokemonModel } from '@/models/PokemonModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class PokemonRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.POKEMONS, PokemonModel);
    }
}

export const pokemonRepository = new PokemonRepositoryClass();
