import { FinancialService } from '@/services/FinancialService';
import { DATE_FILTER } from '@/enums/DateFilters';

// Data fixa: quinta-feira, 26 de março de 2026, meio-dia UTC
const FIXED_NOW = new Date('2026-03-26T12:00:00.000Z');

const makeExpense = (date) => ({ date, amount: 100 });

describe('FinancialService', () => {

    describe('filterExpenses', () => {

        beforeEach(() => {
            jest.useFakeTimers();
            jest.setSystemTime(FIXED_NOW);
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        describe('DAILY', () => {
            it('inclui item de hoje', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-26')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.DAILY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item de ontem', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-25')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.DAILY,
                });
                expect(list).toHaveLength(0);
            });

            it('exclui item de amanhã', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-27')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.DAILY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('WEEKLY (não relativo)', () => {
            // 26/03 é quinta (day=4); semana vai de dom 22/03 a sáb 28/03
            it('inclui item no meio da semana', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-24')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.WEEKLY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item da semana anterior', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-21')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.WEEKLY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('WEEKLY (relativo)', () => {
            it('inclui item de 3 dias atrás', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-23')],
                    isRelative: true,
                    dateFilter: DATE_FILTER.WEEKLY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item de 8 dias atrás', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-18')],
                    isRelative: true,
                    dateFilter: DATE_FILTER.WEEKLY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('MONTHLY (não relativo)', () => {
            it('inclui item no meio do mês', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-15')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item do mês anterior', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-02-15')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toHaveLength(0);
            });

            it('exclui item do próximo mês', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-04-01')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('MONTHLY (relativo)', () => {
            it('inclui item de 15 dias atrás', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-03-11')],
                    isRelative: true,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item de 40 dias atrás', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-02-14')],
                    isRelative: true,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('QUARTERLY (não relativo)', () => {
            // Q1 2026: jan-mar
            it('inclui item de janeiro', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-01-15')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.QUARTERLY,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item do trimestre anterior', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2025-12-31')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.QUARTERLY,
                });
                expect(list).toHaveLength(0);
            });

            it('exclui item do próximo trimestre', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-04-15')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.QUARTERLY,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('BIANNUAL (não relativo)', () => {
            // 1º semestre 2026: jan-jun
            it('inclui item de fevereiro', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-02-10')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.BIANNUAL,
                });
                expect(list).toHaveLength(1);
            });

            it('exclui item do semestre anterior', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2025-11-01')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.BIANNUAL,
                });
                expect(list).toHaveLength(0);
            });

            it('exclui item do próximo semestre', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-07-01')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.BIANNUAL,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('ANNUAL (não relativo)', () => {
            it('inclui item de qualquer mês do ano corrente', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2026-07-04'), makeExpense('2026-01-01')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.ANNUAL,
                });
                expect(list).toHaveLength(2);
            });

            it('exclui item do ano anterior', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2025-06-15')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.ANNUAL,
                });
                expect(list).toHaveLength(0);
            });

            it('exclui item do próximo ano', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [makeExpense('2027-01-01')],
                    isRelative: false,
                    dateFilter: DATE_FILTER.ANNUAL,
                });
                expect(list).toHaveLength(0);
            });
        });

        describe('TOTAL (default)', () => {
            it('inclui todos os itens independente da data', () => {
                const expenses = [
                    makeExpense('2000-01-01'),
                    makeExpense('2015-06-15'),
                    makeExpense('2026-03-26'),
                ];
                const { list } = FinancialService.filterExpenses({
                    expenses,
                    isRelative: false,
                    dateFilter: DATE_FILTER.TOTAL,
                });
                expect(list).toHaveLength(3);
            });
        });

        describe('retorno de startDate e endDate', () => {
            it('retorna startDate e endDate para filtro MONTHLY', () => {
                const { startDate, endDate } = FinancialService.filterExpenses({
                    expenses: [],
                    isRelative: false,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(startDate).toBeInstanceOf(Date);
                expect(endDate).toBeInstanceOf(Date);
                expect(startDate.getMonth()).toBe(2); // março
                expect(endDate.getMonth()).toBe(2);
            });
        });

        describe('lista vazia', () => {
            it('retorna lista vazia sem erros', () => {
                const { list } = FinancialService.filterExpenses({
                    expenses: [],
                    isRelative: false,
                    dateFilter: DATE_FILTER.MONTHLY,
                });
                expect(list).toEqual([]);
            });
        });

    });

});
