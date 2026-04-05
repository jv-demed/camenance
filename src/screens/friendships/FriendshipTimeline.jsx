'use client'
import { useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { URGENCY_COLORS, URGENCY_STATUS } from '@/services/FriendshipService';
import { FRIENDSHIP_LEVEL_LABELS } from '@/enums/FriendshipLevelTypes';
import { MAINTENANCE_LABELS } from '@/enums/MaintenanceTypes';
import { SpinLoader } from '@/components/elements/SpinLoader';

const URGENCY_LABELS = {
    [URGENCY_STATUS.OVERDUE]: 'Atrasado',
    [URGENCY_STATUS.SOON]: 'Em breve',
    [URGENCY_STATUS.OK]: 'Ok',
};

function formatDaysSince(days) {
    if (days === null || days === undefined) return 'Nunca se encontraram';
    if (days === 0) return 'Hoje';
    if (days === 1) return 'Ontem';
    return `Há ${days} dias`;
}

const ITEMS_PER_ROW = 6;
const ROW_HEIGHT = 80;

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

function formatShortDate(dateStr) {
    if (!dateStr) return '?';
    const [, month, day] = dateStr.split('-');
    return `${parseInt(day)}/${parseInt(month)}`;
}

function FriendBubble({ friend, urgency, daysSince, onClick }) {
    const [cardPos, setCardPos] = useState(null);
    const btnRef = useRef(null);
    const color = URGENCY_COLORS[urgency];

    function handleMouseEnter() {
        if (btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();
            setCardPos({
                bottom: window.innerHeight - rect.top + 8,
                left: rect.left + rect.width / 2,
            });
        }
    }

    return (
        <div className='shrink-0' onMouseEnter={handleMouseEnter} onMouseLeave={() => setCardPos(null)}>
            {cardPos && createPortal(
                <div
                    className='fixed z-[9999] w-44 bg-white rounded-xl shadow-lg border border-border p-3 pointer-events-none'
                    style={{ bottom: cardPos.bottom, left: cardPos.left, transform: 'translateX(-50%)' }}
                >
                    <p className='font-semibold text-gray-800 text-sm truncate'>{friend.name}</p>
                    <p className='text-xs text-gray-400 mt-0.5'>{FRIENDSHIP_LEVEL_LABELS[friend.friendshipLevel]}</p>
                    <p className='text-xs text-gray-400'>Manutenção {MAINTENANCE_LABELS[friend.maintenance]}</p>
                    <p className='text-xs mt-1.5 font-medium' style={{ color }}>
                        {formatDaysSince(daysSince)} · {URGENCY_LABELS[urgency]}
                    </p>
                </div>,
                document.body
            )}
            <button
                ref={btnRef}
                onClick={onClick}
                className='w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white transition-transform hover:scale-110'
                style={{ backgroundColor: color, boxShadow: `0 0 0 2px white, 0 0 0 3px ${color}` }}
            >
                {getInitials(friend.name)}
            </button>
        </div>
    );
}

function EncounterBubble({ encounter, friendsMap, onClick }) {
    const friendNames = (encounter.friendIds || [])
        .map(id => friendsMap[id]?.name || '?')
        .join(', ');

    return (
        <button
            onClick={onClick}
            title={`${formatShortDate(encounter.date)} — ${friendNames}`}
            className='shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-400 bg-white border-2 border-border hover:border-primary hover:text-primary transition-colors'
            style={{ fontSize: 10 }}
        >
            {formatShortDate(encounter.date)}
        </button>
    );
}

export function FriendshipTimeline({ timelineItems, encounters = [], friends = [], loading, onRegisterEncounter, onEditEncounter }) {

    const friendsMap = useMemo(() => {
        const map = {};
        friends.forEach(f => { map[f.id] = f; });
        return map;
    }, [friends]);

    if (loading) return <SpinLoader />;

    if (timelineItems.length === 0 && encounters.length === 0) {
        return (
            <p className='text-gray-400 text-sm text-center py-8'>
                Nenhum amigo para mostrar na timeline. Cadastre amigos com manutenção habilitada.
            </p>
        );
    }

    const priorityItems = timelineItems.filter(
        ({ urgency }) => urgency === URGENCY_STATUS.OVERDUE || urgency === URGENCY_STATUS.SOON
    );

    const allNodes = [
        ...priorityItems.map(({ friend, urgency, daysSince }) => ({
            kind: 'friend',
            id: `friend-${friend.id}`,
            friend,
            urgency,
            daysSince,
        })),
        ...encounters.map(enc => ({
            kind: 'encounter',
            id: `enc-${enc.id}`,
            encounter: enc,
        })),
    ];

    if (allNodes.length === 0) {
        return (
            <p className='text-gray-400 text-sm text-center py-8'>
                Nenhum dado para mostrar.
            </p>
        );
    }

    const rows = [];
    for (let i = 0; i < allNodes.length; i += ITEMS_PER_ROW) {
        rows.push(allNodes.slice(i, i + ITEMS_PER_ROW));
    }

    return (
        <div className='relative w-full'>
            {rows.map((rowNodes, rowIdx) => {
                const isReversed = rowIdx % 2 === 0;
                const isLast = rowIdx === rows.length - 1;
                const mid = ROW_HEIGHT / 2;

                return (
                    <div key={rowIdx} className='relative' style={{ height: ROW_HEIGHT }}>

                        {/* Linha horizontal */}
                        <div
                            className='absolute left-0 right-0 bg-border'
                            style={{ top: mid, height: 1 }}
                        />

                        {/* Bolinhas */}
                        <div className={`absolute inset-0 flex items-center justify-around px-2 ${isReversed ? 'flex-row-reverse' : ''}`}>
                            {rowNodes.map(node =>
                                node.kind === 'friend' ? (
                                    <FriendBubble
                                        key={node.id}
                                        friend={node.friend}
                                        urgency={node.urgency}
                                        daysSince={node.daysSince}
                                        onClick={() => onRegisterEncounter(node.friend)}
                                    />
                                ) : (
                                    <EncounterBubble
                                        key={node.id}
                                        encounter={node.encounter}
                                        friendsMap={friendsMap}
                                        onClick={() => onEditEncounter(node.encounter)}
                                    />
                                )
                            )}
                        </div>

                        {/* Conector vertical para a próxima fila */}
                        {!isLast && (
                            <div
                                className='absolute bg-border'
                                style={{
                                    [isReversed ? 'left' : 'right']: 0,
                                    top: mid,
                                    height: ROW_HEIGHT,
                                    width: 1,
                                }}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
