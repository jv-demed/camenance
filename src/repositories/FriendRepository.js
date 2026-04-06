import { TableNames } from '@/assets/TableNames';
import { FriendModel } from '@/models/FriendModel';
import { BaseRepository } from '@/repositories/BaseRepository';

export class FriendRepositoryClass extends BaseRepository {
    constructor() {
        super(TableNames.FRIENDS, FriendModel);
    }
}

export const friendRepository = new FriendRepositoryClass();
