import { useEffect, useState } from 'react';
import { MonetaryService } from '@/services/monetaryService';

export function MoneyInput({
    value,
    setValue,
    placeholder = 'R$ 0,00',
    required = false,
    width = '100%',
    style = {}
}) {
    
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (typeof value === 'number') {
            setDisplayValue(MonetaryService.floatToBr(value));
        } else {
            setDisplayValue('');
        }
    }, [value]);

    function applyMask(value) {
        const numeric = value.replace(/\D/g, '');
        const float = parseFloat(numeric) / 100;
        if (isNaN(float)) return 'R$ 0,00';
        return MonetaryService.floatToBr(float);
    }

    function handleChange(e) {
        const raw = e.target.value;
        const floatValue = MonetaryService.brToFloat(raw);
        setValue(floatValue);
        setDisplayValue(applyMask(raw));
    }

    return (
        <div className='relative'>
            <input
                type='text'
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                required={required}
                style={{
                    width: width,
                    ...style
                }}
                className={`
                    p-3 w-full
                    border border-gray-300 rounded-xl
                    hover:ring-1 hover:ring-primary
                    focus:ring-1 focus:ring-primary focus:outline-0
                `}
                inputMode='numeric'
            />
        </div>
    );
}