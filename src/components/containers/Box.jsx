export function Box({ 
    children
}) {
    return (
        <div className={`
            rounded-xl px-4 py-2
            border border-white/20
            shadow-[1px_3px_2px_0_rgba(0,0,0,0.2)]
        `}
        >
            {children}
        </div>
    );
};