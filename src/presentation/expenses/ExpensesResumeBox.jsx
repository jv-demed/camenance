'use client'
import { useEffect, useState } from 'react';
import { Box } from '@/components/containers/Box';
import { resumeFilters } from '@/controllers/expenses/resumeController';
import { SelectMiniInput } from '@/components/inputs/SelectMiniInput';

export function ExpensesResumeBox(){

    const [filter, setFilter] = useState(resumeFilters[2]);

    useEffect(() => {
        console.log(filter);
    }, [filter]);

    return (
        <div className='w-full border'>
            <header className='flex items-center justify-between'>
                <span className='text-xl'>
                    Saldo
                </span>
                <SelectMiniInput 
                    options={resumeFilters}
                    value={filter}
                    setValue={setFilter}
                />
            </header>
        </div>
    )
}