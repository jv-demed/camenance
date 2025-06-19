import { useEffect, useState } from 'react';

export function DateInput({
    value,
    setValue, 
    required = false,
    width = '120px',
    style = {}
}) {

    const [isValid, setIsValid] = useState(true);

    useEffect(() => {
        if(!value) {
            setIsValid(true);
            return;
        }
        const [yearStr] = value.split('-');
        const year = parseInt(yearStr, 10);
        const currentYear = new Date().getFullYear();
        if(isNaN(year) || year < 1900 || year > currentYear+10) {
            setIsValid(false);
        } else {
            setIsValid(true);
        }
    }, [value]);

    return (
        <div className='relative'>
            <input type='date'
                value={value || ''}
                onChange={e => setValue(e.target.value)}
                required={required}
                style={{
                    width: width,
                    ...style
                }}
                className={`
                    border rounded-xl p-3
                    focus:outline-0
                    ${isValid && `
                        border-border hover:ring-1 hover:ring-primary
                        focus:ring-1 focus:ring-primary
                    `}
                    ${!isValid && 'border-error ring ring-error'}
                `}
            />
        </div>
    );
}