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
                border border-gray-300 rounded-md 
                p-3 w-full
                ${className}
            `}
        />
    );
}