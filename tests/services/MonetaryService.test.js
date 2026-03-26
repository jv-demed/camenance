import { MonetaryService } from '@/services/monetaryService';

describe('MonetaryService', () => {

    describe('floatToBr', () => {
        it('formata número como moeda brasileira', () => {
            expect(MonetaryService.floatToBr(1234.56)).toMatch(/1\.234,56/);
        });

        it('formata zero corretamente', () => {
            expect(MonetaryService.floatToBr(0)).toMatch(/0,00/);
        });

        it('retorna string vazia para não-número', () => {
            expect(MonetaryService.floatToBr('abc')).toBe('');
            expect(MonetaryService.floatToBr(null)).toBe('');
            expect(MonetaryService.floatToBr(undefined)).toBe('');
        });
    });

    describe('brToFloat', () => {
        it('converte string formatada para float', () => {
            expect(MonetaryService.brToFloat('R$ 1.234,56')).toBe(1234.56);
            // '100,00' → remove não-dígitos → '10000' → 10000/100 = 100
            expect(MonetaryService.brToFloat('100,00')).toBe(100);
        });

        it('retorna 0 para não-string', () => {
            expect(MonetaryService.brToFloat(123)).toBe(0);
            expect(MonetaryService.brToFloat(null)).toBe(0);
        });
    });

});
