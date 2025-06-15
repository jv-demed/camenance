import { useEffect } from 'react';

export function SelectInput({
    items = [],
    value,
    setValue,
    displayField = 'name',
    valueField = 'id',
    required = false
}) {

    useEffect(() => {
        if((!value || value === '') && items.length > 0) {
            setValue && setValue(items[0][valueField]);
        }
    }, [value]);

    return (
        <select
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            required={required}
            className={`
                p-3 w-full
                border border-gray-300 rounded-xl
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
            `}
        >
            {items.map((item, index) => (
                <option key={index} value={item[valueField]}>
                    {item[displayField]}
                </option>
            ))}
        </select>
    );
}