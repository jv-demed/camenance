export function ActionsSection({ children }) {
    return (
        <section className={`
            flex justify-end gap-1
            border-t border-border pt-2 w-full
        `}>
            {children}
        </section>
    )
}