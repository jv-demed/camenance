import { cdiRateRepository } from '@/repositories/CdiRateRepository';
import { DateService } from '@/services/DateService';

/**
 * CDI diário via API do Banco Central (série 12).
 * A API retorna a taxa diária em percentual (ex: "0.043739" = 0,043739% a.d.).
 * Armazenamos em decimal (ex: 0.00043739) para facilitar os cálculos.
 *
 * Endpoint:
 *   https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados?formato=json&dataInicial=dd/mm/aaaa&dataFinal=dd/mm/aaaa
 */
export class CdiService {

    static BCB_URL = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados';

    /**
     * Garante que o cache local contém todas as taxas entre `startDate` e `endDate` (inclusive).
     * Faz fetch apenas dos dias faltantes.
     * Datas em formato SQL (yyyy-mm-dd).
     */
    static async ensureRatesCached(startDate, endDate) {
        const existing = await cdiRateRepository.findAll({});
        const existingDates = new Set(existing.map(r => r.date));

        const missingStart = this.#firstMissingDate(existingDates, startDate, endDate);
        if (!missingStart) return;

        const fetched = await this.#fetchFromBcb(missingStart, endDate);
        for (const row of fetched) {
            if (existingDates.has(row.date)) continue;
            await cdiRateRepository.insert(row);
        }
    }

    /**
     * Retorna a lista de taxas entre `startDate` e `endDate` ordenadas por data.
     * Garante cache antes de ler.
     */
    static async getRatesBetween(startDate, endDate) {
        await this.ensureRatesCached(startDate, endDate);
        const all = await cdiRateRepository.findAll({}, { column: 'date', ascending: true });
        return all.filter(r => r.date >= startDate && r.date <= endDate);
    }

    static async #fetchFromBcb(startDate, endDate) {
        const url = `${this.BCB_URL}?formato=json`
            + `&dataInicial=${this.#sqlToBcb(startDate)}`
            + `&dataFinal=${this.#sqlToBcb(endDate)}`;
        const res = await fetch(url);
        if (res.status === 404) return [];
        if (!res.ok) throw new Error(`Falha ao buscar CDI: ${res.status}`);
        const data = await res.json();
        return data.map(item => ({
            date: this.#bcbToSql(item.data),
            rate: parseFloat(item.valor) / 100,
        }));
    }

    static #firstMissingDate(existingDates, startDate, endDate) {
        const start = this.#parseSql(startDate);
        const end = this.#parseSql(endDate);
        const d = new Date(start);
        while (d <= end) {
            const sql = DateService.dateToSqlDate(d);
            const day = d.getDay();
            const isBusiness = day >= 1 && day <= 5;
            if (isBusiness && !existingDates.has(sql)) return sql;
            d.setDate(d.getDate() + 1);
        }
        return null;
    }

    static #sqlToBcb(sqlDate) {
        const [y, m, d] = sqlDate.split('-');
        return `${d}/${m}/${y}`;
    }

    static #bcbToSql(bcbDate) {
        const [d, m, y] = bcbDate.split('/');
        return `${y}-${m}-${d}`;
    }

    static #parseSql(sqlDate) {
        const [y, m, d] = sqlDate.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

}
