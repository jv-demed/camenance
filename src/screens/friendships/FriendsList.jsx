'use client'
import { useState } from 'react';
import { FriendCard } from '@/screens/friendships/FriendCard';
import { SearchBar } from '@/components/inputs/SearchBar';

export function FriendsList({ friends, onEdit, onRegisterEncounter }) {
    const [search, setSearch] = useState('');

    const filtered = friends.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className='flex flex-col gap-3 w-full'>
            <SearchBar value={search} setValue={setSearch} />
            {filtered.length === 0 ? (
                <p className='text-gray-400 text-sm text-center py-8'>
                    {search ? 'Nenhum amigo encontrado.' : 'Nenhum amigo cadastrado ainda.'}
                </p>
            ) : (
                <div className='flex flex-col gap-2'>
                    {filtered.map(friend => (
                        <FriendCard
                            key={friend.id}
                            friend={friend}
                            onEdit={() => onEdit(friend)}
                            onRegisterEncounter={() => onRegisterEncounter(friend)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
