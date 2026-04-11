import { useState, useRef, useEffect } from 'react';
import { ICONS } from '@/assets/icons';
import { DATE_FILTER } from '@/enums/DateFilters';
import { DateService } from '@/services/DateService';
import { SwitchBtn } from '@/components/buttons/SwitchBtn';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';

const SELECTABLE_FILTERS = Object.values(DATE_FILTER).filter(f => f !== DATE_FILTER.CUSTOM);

export function FinancialFilters({
    dateFilter,
    setDateFilter,
    isRelative,
    setIsRelative,
    startDate,
    endDate,
    customDateRange,
    setCustomDateRange,
}) {
    const [isOpen, setIsOpen]   = useState(false);
    const [draft, setDraft]     = useState({ startDate: '', endDate: '' });
    const popoverRef            = useRef(null);

    const isCustom = dateFilter === DATE_FILTER.CUSTOM;

    const startDisplay = startDate ? DateService.dateToBrDate(startDate) : 'Início';
    const endDisplay   = endDate   ? DateService.dateToBrDate(endDate)   : 'Fim';
    const startValue   = startDate ? DateService.dateToSqlDate(startDate) : '';
    const endValue     = endDate   ? DateService.dateToSqlDate(endDate)   : '';

    useEffect(() => {
        if (!isOpen) return;
        function onClickOutside(e) {
            if (popoverRef.current && !popoverRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, [isOpen]);

    function openPicker() {
        setDraft({ startDate: startValue, endDate: endValue });
        setIsOpen(true);
    }

    function handleConfirm() {
        if (!draft.startDate) return;
        setCustomDateRange({
            startDate: draft.startDate,
            endDate:   draft.endDate || draft.startDate,
        });
        if (!isCustom) setDateFilter(DATE_FILTER.CUSTOM);
        setIsOpen(false);
    }

    return (
        <div className='flex gap-2'>
            <SelectMiniInput
                options={SELECTABLE_FILTERS}
                value={dateFilter}
                setValue={setDateFilter}
            />
            {dateFilter !== DATE_FILTER.TOTAL && (
                <div ref={popoverRef} className='relative'>
                    <button
                        type='button'
                        onClick={openPicker}
                        className='flex items-center gap-1 text-xs border border-border rounded-2xl p-2 hover:border-white/40 transition-colors'
                    >
                        <span>{startDisplay}</span>
                        {dateFilter !== DATE_FILTER.DAILY && <>
                            <ICONS.chevronRight />
                            <span>{endDisplay}</span>
                        </>}
                    </button>

                    {isOpen && (
                        <div className='absolute top-full mt-1 right-0 z-50 bg-white border border-gray-200 rounded-2xl shadow-lg p-3 flex flex-col gap-3 min-w-[220px]'>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs text-gray-400'>Início</label>
                                <input
                                    type='date'
                                    value={draft.startDate}
                                    onChange={e => setDraft(d => ({ ...d, startDate: e.target.value }))}
                                    className='border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-primary'
                                />
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label className='text-xs text-gray-400'>Fim</label>
                                <input
                                    type='date'
                                    value={draft.endDate}
                                    min={draft.startDate}
                                    onChange={e => setDraft(d => ({ ...d, endDate: e.target.value }))}
                                    className='border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-gray-700 outline-none focus:ring-1 focus:ring-primary'
                                />
                            </div>
                            <button
                                type='button'
                                onClick={handleConfirm}
                                disabled={!draft.startDate}
                                className='w-full bg-primary text-white text-xs rounded-lg py-1.5 font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Confirmar
                            </button>
                        </div>
                    )}
                </div>
            )}
            {!isCustom && dateFilter !== DATE_FILTER.TOTAL && dateFilter !== DATE_FILTER.DAILY && (
                <div className='border border-border rounded-2xl p-1'>
                    <SwitchBtn
                        isOn={isRelative}
                        onToggle={setIsRelative}
                        labelLeft={() => <span className='text-xs text-center w-12'>Fixo</span>}
                        labelRight={() => <span className='text-xs text-center w-12'>Relativo</span>}
                        alwaysActivedColor
                    />
                </div>
            )}
        </div>
    );
}
