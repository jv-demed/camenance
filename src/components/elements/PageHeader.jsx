export function PageHeader({ children, title }) {
    return (
        <header className={`
            flex items-center justify-between
            border-b border-border pb-1
        `}>
            <h1 className='text-xl'>
                {title}
            </h1>
            <div className='flex items-center gap-2'>
                {children}
            </div>
        </header>
    )
}