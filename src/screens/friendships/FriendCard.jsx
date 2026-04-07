'use client'
import { FRIENDSHIP_LEVEL_LABELS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE_LABELS } from '@/enums/MaintenanceTypes';
import { ICONS } from '@/assets/icons';

function getInitials(name) {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(w => w[0].toUpperCase())
        .join('');
}

function formatBirthday(birthday) {
    if (!birthday) return null;
    const [, month, day] = birthday.split('-');
    return `${day}/${month}`;
}

export function FriendCard({ friend, onEdit, onRegisterEncounter }) {
    const initials = getInitials(friend.name);
    const birthday = formatBirthday(friend.birthday);

    return (
        <div className='bg-white rounded-xl border border-gray-200 px-3 py-3 flex items-center gap-3 hover:shadow-md hover:border-gray-300 transition-all group'>
            {/* Avatar */}
            <div className='w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 select-none'>
                {initials}
            </div>

            {/* Info */}
            <div className='flex flex-col gap-1 min-w-0 flex-1'>
                <span className='font-semibold text-gray-800 text-sm truncate leading-tight'>{friend.name}</span>
                <div className='flex items-center gap-1.5 flex-wrap'>
                    <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full leading-none'>
                        {FRIENDSHIP_LEVEL_LABELS[friend.friendshipLevel]}
                    </span>
                    <span className='text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full leading-none'>
                        {MAINTENANCE_LABELS[friend.maintenance]}
                    </span>
                    {birthday && (
                        <span className='text-xs text-gray-400 leading-none'>🎂 {birthday}</span>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                <button
                    onClick={onRegisterEncounter}
                    title='Registrar rolê'
                    className='p-1.5 rounded-lg text-primary hover:bg-primary/10 transition-colors text-base'
                >
                    <ICONS.add />
                </button>
                <button
                    onClick={onEdit}
                    title='Editar amigo'
                    className='p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors text-sm'
                >
                    <ICONS.edit />
                </button>
            </div>
        </div>
    );
}
