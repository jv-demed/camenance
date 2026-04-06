'use client'
import { URGENCY_COLORS, URGENCY_STATUS } from '@/services/FriendshipService';
import { FRIENDSHIP_LEVEL_LABELS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE_LABELS } from '@/enums/MaintenanceTypes';
import { ICONS } from '@/assets/icons';

const URGENCY_LABELS = {
    [URGENCY_STATUS.OVERDUE]: 'Atrasado',
    [URGENCY_STATUS.SOON]: 'Em breve',
    [URGENCY_STATUS.OK]: 'Ok',
};

function formatDaysSince(days) {
    if (days === null) return 'Nunca se encontraram';
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `Há ${days} dias`;
}

export function TimelineCard({ friend, daysSince, urgency, onRegisterEncounter }) {
    const color = URGENCY_COLORS[urgency];

    return (
        <div
            className='bg-white rounded-xl border border-border px-4 py-3 flex items-center gap-4 hover:shadow-md transition-shadow'
            style={{ borderLeft: `4px solid ${color}` }}
        >
            <div className='flex flex-col gap-0.5 flex-1 min-w-0'>
                <span className='font-medium truncate'>{friend.name}</span>
                <div className='flex gap-2 text-xs text-gray-400'>
                    <span>{FRIENDSHIP_LEVEL_LABELS[friend.friendshipLevel]}</span>
                    <span>·</span>
                    <span>Manutenção {MAINTENANCE_LABELS[friend.maintenance]}</span>
                </div>
                <span className='text-xs mt-1' style={{ color }}>
                    {formatDaysSince(daysSince)} · {URGENCY_LABELS[urgency]}
                </span>
            </div>
            <button
                onClick={onRegisterEncounter}
                title='Registrar rolê'
                className='shrink-0 p-2 rounded-lg text-primary hover:bg-primary/10 transition-colors text-lg'
            >
                <ICONS.add />
            </button>
        </div>
    );
}
