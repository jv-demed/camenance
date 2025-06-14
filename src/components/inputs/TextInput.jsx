export function TextInput({
    value,
    setValue,
    placeholder = '',
    type = 'text',
    required = false,
    className = '',
}){
    return (
        <input
            type={type}
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`
                p-3 w-full
                border border-gray-300 rounded-xl
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
                ${className}
            `}
        />
    );
}