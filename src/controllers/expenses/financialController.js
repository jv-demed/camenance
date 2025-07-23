export const dateFilters = [
    {
        id: '0',
        name: 'Diário'
    },{
        id: '1',
        name: 'Semanal'
    },{
        id: '2',
        name: 'Mensal'
    },{
        id: '3',
        name: 'Trimestral'
    },{
        id: '4',
        name: 'Semestral'
    },{
        id: '5',
        name: 'Anual'
    },{
        id: '6',
        name: 'Total'
    }
];

export function filterExpenses({
    expenses,
    isRelative,
    dateFilter
}) {
    const now = new Date();
    let startDate = null;
    let endDate = null;
    if(isRelative) {
        endDate = now;
    }
    switch(Number(dateFilter.id)) {
        case 0: // Dia
            startDate = new Date(now);
            break;
        case 1: // Semana
            if(isRelative) {
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 6);
            }else {
                const dayOfWeek = now.getDay();
                startDate = new Date(now);
                startDate.setDate(now.getDate() - dayOfWeek);
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
            }
            break;
        case 2: // Mês
            if(isRelative) {
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 1);
            }else {
                const year = now.getFullYear();
                const month = now.getMonth();
                const lastDay = new Date(year, month + 1, 0).getDate();
                startDate = new Date(year, month, 1);
                endDate = new Date(year, month, lastDay, 23, 59, 59, 999);
            }
            break;
        case 3: // Trimestre
            if(isRelative) {
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 3);
            }else {
                const quarter = Math.floor(now.getMonth() / 3);
                startDate = new Date(now.getFullYear(), quarter * 3, 1);
                endDate = new Date(now.getFullYear(), quarter * 3 + 3, 0);
            }
            break;
        case 4: // Semestre
            if(isRelative) {
                startDate = new Date(now);
                startDate.setMonth(now.getMonth() - 6);
            }else {
                const semStart = now.getMonth() < 6 ? 0 : 6;
                startDate = new Date(now.getFullYear(), semStart, 1);
                endDate = new Date(now.getFullYear(), semStart + 6, 0);
            }
            break;
        case 5: // Ano
            if(isRelative) {
                startDate = new Date(now);
                startDate.setFullYear(now.getFullYear() - 1);
            }else {
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear() + 1, 0, 0);
            }
            break;            
        default:
            startDate = new Date(2000, 0, 1);
            endDate = new Date(3000, 12, 0);
    }
    return {
        list: expenses.filter(exp => {
            const d = new Date(exp.date);
            if(startDate && d < startDate) return false;
            if(endDate && d >= endDate) return false;
            return true;
        }),
        startDate,
        endDate
    }
}