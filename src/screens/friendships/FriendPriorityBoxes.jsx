'use client'
import { URGENCY_STATUS } from '@/services/FriendshipService';

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

const BOX_CONFIG = [
    {
        status:    URGENCY_STATUS.OVERDUE,
        label:     'Urgente',
        emptyText: 'Nenhum atrasado',
        bg:        '#fecaca',
        accent:    '#dc2626',
        avatarBg:  '#ef4444',
        hover:     '#fca5a5',
        badgeBg:   '#fca5a5',
        text:      '#7f1d1d',
        sub:       '#991b1b',
    },
    {
        status:    URGENCY_STATUS.SOON,
        label:     'Em breve',
        emptyText: 'Nenhum chegando',
        bg:        '#fde68a',
        accent:    '#b45309',
        avatarBg:  '#f59e0b',
        hover:     '#fcd34d',
        badgeBg:   '#fcd34d',
        text:      '#78350f',
        sub:       '#92400e',
    },
    {
        status:    URGENCY_STATUS.OK,
        label:     'Tranquilo',
        emptyText: 'Tudo em dia',
        bg:        '#bbf7d0',
        accent:    '#15803d',
        avatarBg:  '#22c55e',
        hover:     '#86efac',
        badgeBg:   '#86efac',
        text:      '#14532d',
        sub:       '#166534',
    },
];

export function FriendPriorityBoxes({ timelineItems, onRegisterEncounter }) {
    return (
        <div className='flex flex-col gap-3 w-60 shrink-0 h-full'>
            {BOX_CONFIG.map(({ status, label, emptyText, bg, accent, avatarBg, hover, badgeBg, text, sub }) => {
                const items = timelineItems.filter(item => item.urgency === status);

                return (
                    <div
                        key={status}
                        className='flex-1 rounded-2xl flex flex-col overflow-hidden min-h-0'
                        style={{ backgroundColor: bg }}
                    >
                        {/* Header */}
                        <div className='flex items-center gap-2 px-3 py-2.5 shrink-0' style={{ backgroundColor: hover }}>
                            <span className='text-sm font-bold' style={{ color: accent }}>{label}</span>
                            <span
                                className='ml-auto text-xs font-semibold px-2 py-0.5 rounded-full'
                                style={{ backgroundColor: badgeBg, color: accent }}
                            >
                                {items.length}
                            </span>
                        </div>

                        {/* Friend list */}
                        <div
                            className={`
                                flex flex-col gap-0.5 overflow-y-auto flex-1 min-h-0 p-2
                                [&::-webkit-scrollbar]:w-1.5
                                [&::-webkit-scrollbar-track]:rounded-md
                                [&::-webkit-scrollbar-thumb]:rounded-md
                                [&::-webkit-scrollbar-thumb:hover]:opacity-80
                            `}
                            style={{
                                scrollbarColor: `${hover} transparent`,
                            }}
                        >
                            {items.length === 0 ? (
                                <p className='text-xs text-center py-3' style={{ color: sub }}>
                                    {emptyText}
                                </p>
                            ) : (
                                items.map(({ friend, daysSince }) => (
                                    <button
                                        key={friend.id}
                                        onClick={() => onRegisterEncounter(friend)}
                                        className='flex items-center gap-2 w-full text-left rounded-xl px-2 py-1.5 transition-colors'
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = hover}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <span
                                            className='w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0'
                                            style={{ backgroundColor: avatarBg }}
                                        >
                                            {getInitials(friend.name)}
                                        </span>
                                        <div className='flex flex-col min-w-0'>
                                            <span className='text-xs font-semibold truncate' style={{ color: text }}>
                                                {friend.name.split(' ')[0]}
                                            </span>
                                            <span className='text-[10px]' style={{ color: sub }}>
                                                {daysSince === 0 ? 'Hoje' : daysSince === 1 ? 'Ontem' : `${daysSince}d atrás`}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
