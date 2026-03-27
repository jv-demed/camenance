import { useState, useRef, useEffect } from 'react';
import { ICONS } from '@/assets/icons';

export function SelectInput({
    options = [],
    value,
    setValue,
    placeholder = 'Selecione...',
    isVisible = true,
    disabled = false,
}) {
    if (!isVisible) return null;

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function handleChange(option) {
        setValue(option.value);
        setIsOpen(false);
    }

    const selected = options.find(opt => opt.value === value);

    return (
        <div ref={ref} className='relative w-full'>
            <button type='button'
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`
                    p-3 w-full flex items-center justify-between
                    border border-border rounded-xl
                    ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:ring-1 hover:ring-primary'}
                    ${isOpen ? 'ring-1 ring-primary outline-0' : 'outline-0'}
                `}
            >
                <span className={selected ? '' : 'text-gray-400'}>
                    {selected ? selected.label : placeholder}
                </span>
                {isOpen
                    ? <ICONS.chevronUp className='w-4 h-4 shrink-0' />
                    : <ICONS.chevronDown className='w-4 h-4 shrink-0' />
                }
            </button>
            {isOpen && (
                <ul className={`
                    absolute z-10 mt-1 w-full
                    bg-white border border-border rounded-xl
                    shadow-lg overflow-auto
                `}>
                    {options.map(option => (
                        <li key={option.value}
                            onClick={() => handleChange(option)}
                            className={`
                                px-3 py-2 cursor-pointer
                                hover:bg-primary/20
                                ${option.value === value ? 'font-semibold text-primary' : ''}
                            `}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
