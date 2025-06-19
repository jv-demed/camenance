export class DateService {

    static dateToSupabase(date){
        return date.toISOString().split('T')[0];
    }

    static supabaseToBrWithCompleteMonth(date){
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric',
            timeZone: 'UTC'
        });
    };

    static supabaseToDefaultBr(date){
        if (!date) return '';
        const [year, month, day] = date.split('-');
        return `${day}/${month}/${year}`;
    }
    
    static defaultBrToSupabase(date){
        if (!date) return '';
        const cleaned = date.replace(/\D/g, '');
        const day = cleaned.slice(0, 2);
        const month = cleaned.slice(2, 4);
        const year = cleaned.slice(4, 8);
        if(day.length === 2 && month.length === 2 && year.length === 4) {
            return `${year}-${month}-${day}`;
        }
        return '';
    }

    static validateDefaultBr(dateStr){
        if(!dateStr || dateStr.length < 10) return false;        
        const [day, month, year] = dateStr.split('/').map(Number);
        if(day < 1 || day > 31 || month < 1 || month > 12 || year < 1000) {
            return false;
        }
        if([4, 6, 9, 11].includes(month) && day > 30) {
            return false;
        }
        if(month === 2) {
            const isLeapYear = (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
            if (day > 29 || (day === 29 && !isLeapYear)) {
                return false;
            }
        }
        return true;
    }

}