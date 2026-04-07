'use client'
import { useState, useMemo } from 'react';
import { FriendCard } from '@/screens/friendships/FriendCard';
import { SearchBar } from '@/components/inputs/SearchBar';
import { FRIENDSHIP_LEVEL, FRIENDSHIP_LEVEL_LABELS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE, MAINTENANCE_LABELS } from '@/enums/MaintenanceTypes';

const COLUMN_COLORS = {
    [FRIENDSHIP_LEVEL.BEST_FRIEND]:     { header: 'bg-violet-500', bg: 'bg-violet-50',  border: 'border-violet-200', dot: 'bg-violet-400' },
    [FRIENDSHIP_LEVEL.GREAT_FRIEND]:    { header: 'bg-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-200',   dot: 'bg-blue-400' },
    [FRIENDSHIP_LEVEL.FRIEND]:          { header: 'bg-teal-500',   bg: 'bg-teal-50',    border: 'border-teal-200',   dot: 'bg-teal-400' },
    [MAINTENANCE.HIGH]:                 { header: 'bg-rose-500',   bg: 'bg-rose-50',    border: 'border-rose-200',   dot: 'bg-rose-400' },
    [MAINTENANCE.MEDIUM]:               { header: 'bg-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-200',  dot: 'bg-amber-400' },
    [MAINTENANCE.LOW]:                  { header: 'bg-emerald-500',bg: 'bg-emerald-50', border: 'border-emerald-200',dot: 'bg-emerald-400' },
    [MAINTENANCE.NO_MAINTENANCE]:       { header: 'bg-slate-400',  bg: 'bg-slate-50',   border: 'border-slate-200',  dot: 'bg-slate-400' },
};
const DEFAULT_COLOR = { header: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' };

export function FriendsList({ friends, onEdit, onRegisterEncounter }) {
    const [search, setSearch] = useState('');
    const [groupBy, setGroupBy] = useState('friendshipLevel');

    const filtered = friends.filter(f =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );

    const columns = useMemo(() => {
        if (groupBy === 'friendshipLevel') {
            return [
                { id: FRIENDSHIP_LEVEL.BEST_FRIEND,  label: FRIENDSHIP_LEVEL_LABELS[FRIENDSHIP_LEVEL.BEST_FRIEND] },
                { id: FRIENDSHIP_LEVEL.GREAT_FRIEND, label: FRIENDSHIP_LEVEL_LABELS[FRIENDSHIP_LEVEL.GREAT_FRIEND] },
                { id: FRIENDSHIP_LEVEL.FRIEND,        label: FRIENDSHIP_LEVEL_LABELS[FRIENDSHIP_LEVEL.FRIEND] },
            ];
        } else {
            return [
                { id: MAINTENANCE.HIGH,           label: MAINTENANCE_LABELS[MAINTENANCE.HIGH] },
                { id: MAINTENANCE.MEDIUM,         label: MAINTENANCE_LABELS[MAINTENANCE.MEDIUM] },
                { id: MAINTENANCE.LOW,            label: MAINTENANCE_LABELS[MAINTENANCE.LOW] },
                { id: MAINTENANCE.NO_MAINTENANCE, label: MAINTENANCE_LABELS[MAINTENANCE.NO_MAINTENANCE] },
            ];
        }
    }, [groupBy]);

    const groupedData = useMemo(() => {
        const data = {};
        columns.forEach(col => data[col.id] = []);
        filtered.forEach(friend => {
            const key = friend[groupBy];
            if (data[key]) data[key].push(friend);
        });
        return data;
    }, [filtered, columns, groupBy]);

    return (
        <div className='flex flex-col gap-5 w-full h-full'>
            {/* Toolbar */}
            <div className='flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center'>
                <div className='w-full sm:w-[300px]'>
                    <SearchBar value={search} setValue={setSearch} placeholder='Buscar amigo...' />
                </div>

                <div className="flex bg-gray-100 border border-gray-200 p-1 rounded-xl w-fit shrink-0">
                    <button
                        onClick={() => setGroupBy('friendshipLevel')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${groupBy === 'friendshipLevel' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Grau de Amizade
                    </button>
                    <button
                        onClick={() => setGroupBy('maintenance')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${groupBy === 'maintenance' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Priorização
                    </button>
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className='text-gray-400 text-sm py-8'>
                    {search ? 'Nenhum amigo encontrado.' : 'Nenhum amigo cadastrado ainda.'}
                </p>
            ) : (
                <div className='flex gap-4 overflow-x-auto pb-4 flex-1 items-start min-h-0'>
                    {columns.map(col => {
                        const colors = COLUMN_COLORS[col.id] ?? DEFAULT_COLOR;
                        const count = groupedData[col.id].length;
                        return (
                            <div key={col.id} className={`flex flex-col flex-1 min-w-[240px] rounded-2xl border ${colors.border} ${colors.bg} overflow-hidden h-max shadow-sm`}>
                                {/* Header */}
                                <div className={`${colors.header} px-4 py-3 flex items-center justify-between`}>
                                    <h3 className='font-bold text-white text-sm uppercase tracking-widest'>{col.label}</h3>
                                    <span className='text-xs font-bold bg-black/20 text-white px-2.5 py-0.5 rounded-full min-w-[24px] text-center'>
                                        {count}
                                    </span>
                                </div>

                                {/* Cards */}
                                <div className='flex flex-col gap-2 p-3'>
                                    {count === 0 ? (
                                        <p className='text-xs text-gray-400 text-center py-8'>Nenhum amigo aqui</p>
                                    ) : (
                                        groupedData[col.id].map(friend => (
                                            <FriendCard
                                                key={friend.id}
                                                friend={friend}
                                                onEdit={() => onEdit(friend)}
                                                onRegisterEncounter={() => onRegisterEncounter(friend)}
                                            />
                                        ))
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
