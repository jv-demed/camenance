export function NumberInput({
    value,
    setValue,
    placeholder = '',
    min,
    max,
    step = 1,
    required = false,
    disabled = false,
    style = {},
}){
    return (
        <input
            type='number'
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            required={required}
            disabled={disabled}
            style={{ style }}
            className={`
                p-3 w-full
                border border-border rounded-xl
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
                disabled:opacity-50 disabled:cursor-not-allowed
            `}
        />
    );
}
