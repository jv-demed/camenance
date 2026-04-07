'use client'
import { useEffect, useMemo, useRef, useState } from 'react';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { StorageService } from '@/services/StorageService';

const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 160;
const BUBBLE_TOP  = 8;
const LINE_Y = BUBBLE_TOP + 20;
const CORNER_R = 22;
const PAGE_SIZE = 8; // linhas por página

function formatShortDate(dateStr) {
    if (!dateStr) return '?';
    const [, month, day] = dateStr.split('-');
    return `${parseInt(day)}/${parseInt(month)}`;
}

const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
];

function formatLongDate(dateStr) {
    if (!dateStr) return '?';
    const [year, month, day] = dateStr.split('-');
    const m = meses[parseInt(month, 10) - 1];
    return `${parseInt(day, 10)} de ${m} de ${year}`;
}

function formatMonthYear(dateStr) {
    if (!dateStr) return '';
    const [year, month] = dateStr.split('-');
    return `${month}-${year}`;
}

function buildPath(numRows, W) {
    if (!numRows || !W) return '';
    const H = ROW_HEIGHT;
    const Y = LINE_Y;
    const R = CORNER_R;
    const P = 4;
    const LEFT = P;
    const RIGHT = W - P;

    let d = '';

    for (let i = 0; i < numRows; i++) {
        const y = i * H + Y;
        const reversed = i % 2 === 0;
        const last = i === numRows - 1;

        if (i === 0) d += reversed ? `M ${RIGHT} ${y}` : `M ${LEFT} ${y}`;

        if (reversed) {
            d += ` L ${LEFT + R} ${y}`;
            if (!last) {
                d += ` Q ${LEFT} ${y} ${LEFT} ${y + R}`;
                d += ` L ${LEFT} ${y + H - R}`;
                d += ` Q ${LEFT} ${y + H} ${LEFT + R} ${y + H}`;
            }
        } else {
            d += ` L ${RIGHT - R} ${y}`;
            if (!last) {
                d += ` Q ${RIGHT} ${y} ${RIGHT} ${y + R}`;
                d += ` L ${RIGHT} ${y + H - R}`;
                d += ` Q ${RIGHT} ${y + H} ${RIGHT - R} ${y + H}`;
            }
        }
    }
    return d;
}

function EncounterBubble({ encounter, friendsMap, photo, onClick, isFirstRow }) {
    const [thumbUrl, setThumbUrl] = useState(null);
    const [isLoadingPhoto, setIsLoadingPhoto] = useState(!!photo);

    useEffect(() => {
        if (!photo) {
            setIsLoadingPhoto(false);
            return;
        }
        setIsLoadingPhoto(true);
        StorageService.getUrl(photo.bucket, photo.path)
            .then(url => {
                setThumbUrl(url);
                setIsLoadingPhoto(false);
            })
            .catch(() => {
                setThumbUrl(null);
                setIsLoadingPhoto(false);
            });
    }, [photo]);

    const friendNames = (encounter.friendIds || [])
        .map(id => friendsMap[id]?.name || '?')
        .join(', ');

    return (
        <div className='relative flex flex-col items-center gap-1 shrink-0 group'>
            <button
                onClick={onClick}
                className='w-10 h-10 rounded-full flex items-center justify-center text-gray-400 bg-white border-2 border-border hover:border-primary hover:text-primary transition-colors z-10 relative'
                style={{ fontSize: 10 }}
            >
                {formatShortDate(encounter.date)}
            </button>

            {/* Hover card */}
            <div className={`
                absolute pointer-events-none z-50 w-[240px] flex flex-col items-center
                opacity-0 scale-90 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
                group-hover:opacity-100 group-hover:scale-100
                ${isFirstRow
                    ? 'top-full mt-3 origin-top translate-y-[-10px] group-hover:translate-y-0'
                    : 'bottom-full mb-3 origin-bottom translate-y-[10px] group-hover:translate-y-0'
                }
            `}>
                <div className='relative z-10 w-full bg-white border border-gray-100/80 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.15)] rounded-2xl p-4 overflow-hidden'>
                    <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>

                    <div className="flex flex-col items-center gap-1 mt-1">
                        <span className="bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-[0.15em] px-3 py-1.5 rounded-full mb-1">
                            {formatLongDate(encounter.date)}
                        </span>

                        {encounter.title && (
                            <h4 className="text-gray-900 text-[15px] font-bold text-center leading-snug mt-1 w-full truncate">
                                {encounter.title}
                            </h4>
                        )}

                        <p className="text-gray-500 text-xs text-center font-medium w-full truncate">
                            {friendNames}
                        </p>

                        {encounter.notes && (
                            <div className="mt-2 w-full text-center bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100/50">
                                <p className="text-gray-500 text-[11.5px] leading-relaxed line-clamp-3 italic">
                                   "{encounter.notes}"
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className={`absolute w-4 h-4 bg-white rotate-45 z-0 ${
                    isFirstRow
                        ? '-top-2 border-l border-t border-gray-100/80'
                        : '-bottom-2 border-r border-b border-gray-100/80'
                }`}></div>
            </div>

            {isLoadingPhoto ? (
                <div className='relative flex flex-col items-center mt-2 group/photo'>
                    <div className='absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 z-0'></div>
                    <div className='relative z-10 p-1 bg-white border border-gray-200 shadow-sm rounded-xl w-[114px] h-[82px] flex items-center justify-center'>
                        <div className="w-5 h-5 border-[3px] border-gray-200 border-t-primary rounded-full animate-spin"></div>
                    </div>
                </div>
            ) : thumbUrl ? (
                <div className='relative flex flex-col items-center mt-2 group/photo'>
                    <div className='absolute -top-1.5 w-3 h-3 bg-white border-t border-l border-gray-200 rotate-45 z-0'></div>
                    <div className='relative z-10 p-1 bg-white border border-gray-200 shadow-sm rounded-xl transition-all duration-300 group-hover/photo:-translate-y-1 group-hover/photo:shadow-md'>
                        <img
                            src={thumbUrl}
                            alt={friendNames}
                            className='w-[104px] h-[72px] object-cover rounded-lg'
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export function FriendshipTimeline({ encounters = [], friends = [], photosByEncounter = {}, loading, onEditEncounter }) {

    const containerRef = useRef(null);
    const sentinelRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

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

    const rows = useMemo(() => {
        const result = [];
        let currentRow = [];

        function getMonthYearKey(dateStr) {
            if (!dateStr) return '';
            const [year, month] = dateStr.split('-');
            return `${year}-${month}`;
        }

        encounters.forEach(enc => {
            if (currentRow.length === 0) {
                currentRow.push(enc);
                return;
            }
            const currentGroup = getMonthYearKey(currentRow[0].date);
            const encGroup = getMonthYearKey(enc.date);
            if (currentGroup !== encGroup || currentRow.length >= ITEMS_PER_ROW) {
                result.push(currentRow);
                currentRow = [enc];
            } else {
                currentRow.push(enc);
            }
        });

        if (currentRow.length > 0) result.push(currentRow);
        return result;
    }, [encounters]);

    // Reset ao mudar os dados
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
    }, [encounters]);

    // IntersectionObserver no sentinel
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel || visibleCount >= rows.length) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, rows.length));
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [visibleCount, rows.length]);

    if (loading) return <SpinLoader />;

    if (encounters.length === 0) {
        return (
            <p className='text-gray-400 text-sm text-center py-8'>
                Nenhum rolê registrado ainda.
            </p>
        );
    }

    const visibleRows = rows.slice(0, visibleCount);
    const hasMore = visibleCount < rows.length;

    return (
        <div className='relative w-full'>
            <div
                ref={containerRef}
                className='relative w-full pr-[100px]'
                style={{ minHeight: visibleRows.length * ROW_HEIGHT }}
            >
                {containerWidth > 0 && (
                    <svg
                        className='absolute top-0 left-0 pointer-events-none'
                        width={containerWidth}
                        height={visibleRows.length * ROW_HEIGHT}
                    >
                        <path
                            d={buildPath(visibleRows.length, containerWidth)}
                            fill='none'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            style={{ stroke: 'var(--color-border)' }}
                        />
                    </svg>
                )}

                {visibleRows.map((rowEncs, rowIdx) => {
                    const rowDateLabel = rowEncs[0] ? formatMonthYear(rowEncs[0].date) : '';
                    let showLabel = false;
                    if (rowIdx === 0) {
                        showLabel = true;
                    } else if (rowEncs[0]) {
                        const prevLabel = rows[rowIdx - 1][0] ? formatMonthYear(rows[rowIdx - 1][0].date) : '';
                        if (rowDateLabel !== prevLabel) showLabel = true;
                    }

                    return (
                        <div
                            key={rowIdx}
                            className={`relative flex items-start justify-around px-2 ${rowIdx % 2 === 0 ? 'flex-row-reverse' : ''}`}
                            style={{ height: ROW_HEIGHT, paddingTop: BUBBLE_TOP }}
                        >
                            <div className='absolute right-[-100px] top-0 w-[100px] h-full border-l border-gray-100 pointer-events-none'>
                                {showLabel && (
                                    <span
                                        className='absolute left-1/2 -translate-x-1/2 text-gray-400 text-[11px] font-semibold tracking-wider whitespace-nowrap'
                                        style={{ top: LINE_Y - 8 }}
                                    >
                                        {rowDateLabel}
                                    </span>
                                )}
                            </div>

                            {rowEncs.map(enc => (
                                <EncounterBubble
                                    key={enc.id}
                                    encounter={enc}
                                    friendsMap={friendsMap}
                                    photo={photosByEncounter[enc.id]?.[0] ?? null}
                                    onClick={() => onEditEncounter(enc)}
                                    isFirstRow={rowIdx === 0}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>

            {/* Sentinel + indicador */}
            {hasMore && (
                <div ref={sentinelRef} className='flex items-center justify-center py-6'>
                    <div className='flex items-center gap-2 text-gray-300'>
                        <div className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce' style={{ animationDelay: '0ms' }} />
                        <div className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce' style={{ animationDelay: '150ms' }} />
                        <div className='w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce' style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            )}
        </div>
    );
}
