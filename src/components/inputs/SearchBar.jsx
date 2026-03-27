'use client'
import { useState, useRef, useEffect } from 'react';
import { ICONS } from '@/assets/icons';

export function SearchBar({ value, setValue }) {
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
        else setValue('');
    }, [isOpen]);

    return (
        <div className='flex items-center gap-1'>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'w-40 opacity-100' : 'w-0 opacity-0'}`}>
                <input
                    ref={inputRef}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    placeholder='Buscar...'
                    className='p-2 text-sm border border-border rounded-xl w-40 focus:outline-0 focus:ring-1 focus:ring-primary'
                />
            </div>
            <button
                type='button'
                onClick={() => setIsOpen(o => !o)}
                className={`p-1 rounded-lg text-lg cursor-pointer transition-colors duration-150 ${isOpen ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
            >
                <ICONS.search />
            </button>
        </div>
    );
}
