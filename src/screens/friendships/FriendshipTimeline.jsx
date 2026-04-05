'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { StorageService } from '@/services/StorageService';

const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 160;
const BUBBLE_TOP  = 8;   // pt-2 — distância do topo até o início da bolinha
const LINE_Y = BUBBLE_TOP + 20; // centro da bolinha (h-10/2 = 20px)
const CORNER_R = 22;

function formatShortDate(dateStr) {
    if (!dateStr) return '?';
    const [, month, day] = dateStr.split('-');
    return `${parseInt(day)}/${parseInt(month)}`;
}

function buildPath(numRows, W) {
    if (!numRows || !W) return '';
    const H = ROW_HEIGHT;
    const Y = LINE_Y;
    const R = CORNER_R;
    let d = '';

    for (let i = 0; i < numRows; i++) {
        const y = i * H + Y;
        const reversed = i % 2 === 0;
        const last = i === numRows - 1;

        if (i === 0) d += reversed ? `M ${W} ${y}` : `M 0 ${y}`;

        if (reversed) {
            d += ` L ${R} ${y}`;
            if (!last) {
                d += ` Q 0 ${y} 0 ${y + R}`;
                d += ` L 0 ${y + H - R}`;
                d += ` Q 0 ${y + H} ${R} ${y + H}`;
            }
        } else {
            d += ` L ${W - R} ${y}`;
            if (!last) {
                d += ` Q ${W} ${y} ${W} ${y + R}`;
                d += ` L ${W} ${y + H - R}`;
                d += ` Q ${W} ${y + H} ${W - R} ${y + H}`;
            }
        }
    }
    return d;
}

function EncounterBubble({ encounter, friendsMap, photo, onClick }) {
    const [thumbUrl, setThumbUrl] = useState(null);

    useEffect(() => {
        if (!photo) return;
        StorageService.getUrl(photo.bucket, photo.path)
            .then(setThumbUrl)
            .catch(() => setThumbUrl(null));
    }, [photo]);

    const friendNames = (encounter.friendIds || [])
        .map(id => friendsMap[id]?.name || '?')
        .join(', ');

    return (
        <div className='flex flex-col items-center gap-1 shrink-0'>
            <button
                onClick={onClick}
                title={`${formatShortDate(encounter.date)} — ${friendNames}`}
                className='w-10 h-10 rounded-full flex items-center justify-center text-gray-400 bg-white border-2 border-border hover:border-primary hover:text-primary transition-colors'
                style={{ fontSize: 10 }}
            >
                {formatShortDate(encounter.date)}
            </button>

            {thumbUrl && (
                <img
                    src={thumbUrl}
                    alt={friendNames}
                    className='w-32 h-24 object-cover rounded-xl'
                />
            )}
        </div>
    );
}

export function FriendshipTimeline({ encounters = [], friends = [], photosByEncounter = {}, loading, onEditEncounter }) {

    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const friendsMap = useMemo(() => {
        const map = {};
        friends.forEach(f => { map[f.id] = f; });
        return map;
    }, [friends]);

    if (loading) return <SpinLoader />;

    if (encounters.length === 0) {
        return (
            <p className='text-gray-400 text-sm text-center py-8'>
                Nenhum encontro registrado ainda.
            </p>
        );
    }

    const rows = [];
    for (let i = 0; i < encounters.length; i += ITEMS_PER_ROW) {
        rows.push(encounters.slice(i, i + ITEMS_PER_ROW));
    }

    return (
        <div ref={containerRef} className='relative w-full' style={{ minHeight: rows.length * ROW_HEIGHT }}>

            {containerWidth > 0 && (
                <svg
                    className='absolute inset-0 pointer-events-none'
                    width={containerWidth}
                    height={rows.length * ROW_HEIGHT}
                >
                    <path
                        d={buildPath(rows.length, containerWidth)}
                        fill='none'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        style={{ stroke: 'var(--color-border)' }}
                    />
                </svg>
            )}

            {rows.map((rowEncs, rowIdx) => (
                <div
                    key={rowIdx}
                    className={`relative flex items-start justify-around px-2 ${rowIdx % 2 === 0 ? 'flex-row-reverse' : ''}`}
                    style={{ height: ROW_HEIGHT, paddingTop: BUBBLE_TOP }}
                >
                    {rowEncs.map(enc => (
                        <EncounterBubble
                            key={enc.id}
                            encounter={enc}
                            friendsMap={friendsMap}
                            photo={photosByEncounter[enc.id]?.[0] ?? null}
                            onClick={() => onEditEncounter(enc)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
