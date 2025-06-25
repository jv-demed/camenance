export function Container({ 
    children,
    width = '100%' 
}) {
    return (
        <div
            style={{ width }}
            className={`
                flex flex-col items-center p-4
                bg-white rounded-xl
            `}
        >
            {children}
        </div>
    )
}