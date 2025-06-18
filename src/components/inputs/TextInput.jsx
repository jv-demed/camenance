export function TextInput({
    value,
    setValue,
    placeholder = '',
    type = 'text',
    required = false,
    style = {},
}){
    return (
        <input
            type={type}
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={{ style }}
            className={`
                p-3 w-full
                border border-border rounded-xl
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
            `}
        />
    );
}