import { useEffect, useState } from 'react';
import { dateToDefaultBr, defaultBrToDate, validateDate } from '@/services/dateService';

export function DateInput({
    value,
    setValue, 
    placeholder = 'dd/mm/aaaa',
    required = false,
    className = '',
}) {

    const [displayValue, setDisplayValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    function applyMask(value) {
        let cleaned = value.replace(/\D/g, '');
        if(cleaned.length > 2) {
            cleaned = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        }
        if(cleaned.length > 5) {
            cleaned = `${cleaned.slice(0, 5)}/${cleaned.slice(5, 9)}`;
        }
        return cleaned;
    }

    useEffect(() => {
        const brDate = dateToDefaultBr(value);
        setDisplayValue(brDate);
        setIsValid(validateDate(brDate));

    }, [value]);

    function handleChange(e) {
        const maskedValue = applyMask(e.target.value);
        setDisplayValue(maskedValue);
        if(maskedValue.length === 10) {
            const supabaseDate = defaultBrToDate(maskedValue);
            setValue(supabaseDate);
        }else if (maskedValue === '') {
            setValue('');
        }
    }

    return (
        <div className='relative'>
            <input type='text'
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                className={`
                    p-3 w-full
                    border border-gray-300 rounded-xl
                    hover:ring-1 hover:ring-primary
                    focus:ring-1 focus:ring-primary focus:outline-0
                    ${className}
                `}
                maxLength={10}
            />
            {!isValid && displayValue.length === 10 && (
                <span className='text-xs text-red-500'>
                    Data inválida
                </span>
            )}
        </div>
    );
}