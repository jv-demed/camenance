'use client'
import { FRIENDSHIP_LEVEL_LABELS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE_LABELS } from '@/enums/MaintenanceTypes';
import { ICONS } from '@/assets/icons';

export function FriendCard({ friend, onEdit, onRegisterEncounter }) {
    return (
        <div className='bg-white rounded-xl border border-border px-4 py-3 flex items-center justify-between gap-3 hover:shadow-md transition-shadow'>
            <div className='flex flex-col gap-0.5 min-w-0'>
                <span className='font-medium truncate'>{friend.name}</span>
                <div className='flex gap-2 text-xs text-gray-400'>
                    <span>{FRIENDSHIP_LEVEL_LABELS[friend.friendshipLevel]}</span>
                    <span>·</span>
                    <span>Manutenção {MAINTENANCE_LABELS[friend.maintenance]}</span>
                </div>
            </div>
            <div className='flex items-center gap-2 shrink-0'>
                <button
                    onClick={onRegisterEncounter}
                    title='Registrar rolê'
                    className='p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors text-lg'
                >
                    <ICONS.add />
                </button>
                <button
                    onClick={onEdit}
                    title='Editar amigo'
                    className='p-2 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-base'
                >
                    <ICONS.edit />
                </button>
            </div>
        </div>
    );
}
