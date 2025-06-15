export function TextAreaInput({
    value,
    setValue,
    placeholder = '',
    required = false,
    resize = false
}){
    return (
        <textarea
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            placeholder={placeholder}
            required={required}
            style={{
                resize: resize
            }}
            className={`
                p-3 w-full
                border border-gray-300 rounded-xl
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
            `}
        />
    );
}