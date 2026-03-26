import { DateService } from '@/services/DateService';

describe('DateService', () => {

    describe('sqlDateToBrDate', () => {
        it('converte yyyy-mm-dd para dd/mm/yyyy', () => {
            expect(DateService.sqlDateToBrDate('2024-03-15')).toBe('15/03/2024');
        });

        it('retorna string vazia para valor falsy', () => {
            expect(DateService.sqlDateToBrDate('')).toBe('');
            expect(DateService.sqlDateToBrDate(null)).toBe('');
        });
    });

    describe('brDateToSqlDate', () => {
        it('converte dd/mm/yyyy para yyyy-mm-dd', () => {
            expect(DateService.brDateToSqlDate('15/03/2024')).toBe('2024-03-15');
        });

        it('converte sem separadores', () => {
            expect(DateService.brDateToSqlDate('15032024')).toBe('2024-03-15');
        });

        it('retorna string vazia para data incompleta', () => {
            expect(DateService.brDateToSqlDate('15/03')).toBe('');
        });

        it('retorna string vazia para valor falsy', () => {
            expect(DateService.brDateToSqlDate('')).toBe('');
        });
    });

    describe('validateBrDate', () => {
        it('valida datas corretas', () => {
            expect(DateService.validateBrDate('15/03/2024')).toBe(true);
            expect(DateService.validateBrDate('29/02/2024')).toBe(true); // ano bissexto
            expect(DateService.validateBrDate('31/12/2024')).toBe(true);
        });

        it('rejeita dia inválido para o mês', () => {
            expect(DateService.validateBrDate('31/04/2024')).toBe(false); // abril tem 30 dias
            expect(DateService.validateBrDate('30/02/2024')).toBe(false);
        });

        it('rejeita 29/02 em ano não bissexto', () => {
            expect(DateService.validateBrDate('29/02/2023')).toBe(false);
        });

        it('rejeita mês inválido', () => {
            expect(DateService.validateBrDate('15/13/2024')).toBe(false);
        });

        it('rejeita string curta', () => {
            expect(DateService.validateBrDate('15/03')).toBe(false);
            expect(DateService.validateBrDate('')).toBe(false);
            expect(DateService.validateBrDate(null)).toBe(false);
        });
    });

    describe('dateToSqlDate', () => {
        it('converte Date para yyyy-mm-dd', () => {
            const date = new Date('2024-06-20T12:00:00Z');
            expect(DateService.dateToSqlDate(date)).toBe('2024-06-20');
        });
    });

    describe('timestamptzToSqlDate', () => {
        it('converte timestamp ISO para yyyy-mm-dd', () => {
            expect(DateService.timestamptzToSqlDate('2024-03-15T10:30:00Z')).toBe('2024-03-15');
        });
    });

});
