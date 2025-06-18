export function ActionsSection({ children }) {
    return (
        <section className={`
            border-t border-border pt-2
            flex justify-end gap-1
        `}>
            {children}
        </section>
    )
}