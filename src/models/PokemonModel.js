import { BaseModel } from '@/models/BaseModel';

export class PokemonModel extends BaseModel {

    static fields = {
        id: 'id',
        capturedAt: 'captured_at',
        userId: 'user_id',
        pokedex: 'pokedex',
        species: 'species',
        nickname: 'nickname',
        level: 'level',
        xp: 'xp',
    };

}
