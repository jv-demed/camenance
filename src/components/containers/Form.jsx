export function Form({ 
    children,
    width = 'w-full',
    style = '',
    onSubmit = () => {}
}){
    return (
        <form 
            onSubmit={e => {
                e.preventDefault();
                onSubmit(e);
            }}
            className={`
                flex flex-col items-center justify-start gap-4
                ${width}
                ${style}
            `}
        >
            {children}
        </form>
    );
}