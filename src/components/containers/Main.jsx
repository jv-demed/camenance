export function Main({ 
    children,
    style = '',
}){
    return (
        <main className={`
            flex flex-col items-center justify-start gap-4
            min-h-screen px-[4%] py-5
            ${style}
        `}>
            {children}
        </main>
    );
}