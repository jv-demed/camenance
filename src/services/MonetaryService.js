export class MonetaryService {

    static floatToBr(value) {
        if (typeof value !== 'number') return '';
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2
        });
    }

    static brToFloat(value) {
        if (typeof value !== 'string') return 0;
        const cleaned = value.replace(/\D/g, '');
        return parseFloat(cleaned) / 100;
    }

}