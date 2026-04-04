import { ICONS } from '@/assets/icons';
import { DATE_FILTER } from '@/enums/DateFilters';
import { DateService } from '@/services/DateService';
import { SwitchBtn } from '@/components/buttons/SwitchBtn';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';

export function FinancialFilters({
    dateFilter,
    setDateFilter,
    isRelative,
    setIsRelative,
    startDate,
    endDate
}) {
    return (
        <div className='flex gap-2'>
            <SelectMiniInput 
                options={Object.values(DATE_FILTER)}
                value={dateFilter}
                setValue={setDateFilter}
            />
            {dateFilter !== DATE_FILTER.TOTAL && <>
                <div className='flex items-center gap-1 text-xs border border-border rounded-2xl p-2'>
                    <span>
                        {DateService.dateToBrDate(startDate)}
                    </span>
                    {dateFilter !== DATE_FILTER.DAILY && <>
                        <ICONS.chevronRight />
                        <span>
                            {DateService.dateToBrDate(endDate)}
                        </span>
                    </>}
                </div>
                {dateFilter !== DATE_FILTER.DAILY && <div className='border border-border rounded-2xl p-1'>
                    <SwitchBtn
                        isOn={isRelative}
                        onToggle={setIsRelative}
                        labelLeft={() => <span className={`
                            text-xs text-center w-12
                        `}>
                            Fixo
                        </span>}
                        labelRight={() => <span className={`
                            text-xs text-center w-12
                        `}>
                            Relativo
                        </span>}
                        alwaysActivedColor
                    />
                </div>}
            </>}
        </div>
    )
}