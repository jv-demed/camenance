export function ColorInput({
    value,
    setValue,
    width = '50px'
}) {
    return (
        <input type='color'
            value={value}
            onChange={e => setValue && setValue(e.target.value)}
            style={{
                width: width
            }}
            className={`
                h-[50px] p-1 
                rounded-xl cursor-pointer 
                border border-gray-300
                hover:ring-1 hover:ring-primary
                focus:ring-1 focus:ring-primary focus:outline-0
            `}
        />
    );
}