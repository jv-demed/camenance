import { useEffect, useState } from 'react';
import { DateService } from '@/services/dateService';

export function DateInput({
    value,
    setValue, 
    placeholder = 'dd/mm/aaaa',
    required = false,
    width = '105px',
    style = {}
}) {

    const [displayValue, setDisplayValue] = useState('');
    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        const brDate = DateService.supabaseToDefaultBr(value);
        setDisplayValue(brDate);
        setIsValid(DateService.validateDefaultBr(brDate));
        
    }, [value]);

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

    function handleChange(e) {
        const maskedValue = applyMask(e.target.value);
        setDisplayValue(maskedValue);
        if(maskedValue.length === 10) {
            const supabaseDate = DateService.defaultBrToSupabase(maskedValue);
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
                style={{
                    width: width,
                    ...style
                }}
                className={`
                    border border-gray-300 rounded-xl p-3
                    hover:ring-1 hover:ring-primary
                    focus:ring-1 focus:ring-primary focus:outline-0
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