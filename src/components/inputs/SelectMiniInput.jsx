import { useState, useRef, useEffect } from 'react';
import { ICONS } from '@/assets/icons';

export function SelectMiniInput({
  options = [],
  textField = 'name',
  value,
  setValue,
}) {

    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        function onClickOutside(e) {
            if(ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', onClickOutside);
        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    function handleChange(option) {
        setValue(option);
        setIsOpen(false);
    }

    return (
        <div ref={ref}
            className={`
                relative inline-block w-32 
                text-left cursor-pointer    
            `}
        >
            <button type='button'
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between
                    border border-primary rounded-2xl
                    px-3 py-2 text-xs outline-none    
                `}
            >
                {String(value[textField])}
                {isOpen 
                    ? <ICONS.chevronUp className='w-4 h-4' />
                    : <ICONS.chevronDown className='w-4 h-4' />
                }
            </button>
            {isOpen && (
                <ul className={`
                    absolute z-10 mt-1 w-full
                    bg-white border border-gray-200 rounded-2xl
                    shadow-lg overflow-auto
                `}>
                    {options.map(option => (
                        <li key={option.id}
                            onClick={() => handleChange(option)}
                            className={`
                                px-3 py-2 text-xs cursor-pointer
                                hover:bg-primary/20
                                ${option.id === value.id && 'font-semibold text-primary'}
                            `}
                        >
                            {String(option[textField])}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}