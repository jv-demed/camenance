export function DefaultBtn({ 
    text = 'Press',
    type = 'button',
    width = 'w-full',
    style = '',
    onClick = () => {}
}){
    return (
        <button 
            type={type}
            onClick={onClick}
            className={`
                bg-blue-500 cursor-pointer 
                rounded-md p-3 w-full   
                ${width}
                ${style} 
            `}
        >
            {text}
        </button>
    );
}