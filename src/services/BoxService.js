import { boxRepository } from '@/repositories/BoxRepository';
import { boxTransactionRepository } from '@/repositories/BoxTransactionRepository';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { incomeRepository } from '@/repositories/IncomeRepository';
import { BoxTransactionModel } from '@/models/BoxTransactionModel';
import { BoxModel } from '@/models/BoxModel';
import { PAYMENT_TYPES } from '@/enums/PaymentTypes';
import { INCOME_TYPES } from '@/enums/IncomeTypes';
import { CdiService } from '@/services/CdiService';
import { DateService } from '@/services/DateService';

/**
 * Regras do BoxService:
 * - deposit: gasta no fluxo principal (cria expense) e entra na caixinha.
 * - withdraw: resgata da caixinha pro fluxo principal (cria income com valor líquido após IR).
 * - spend: usa saldo da caixinha direto pra uma compra (cria expense). Não mexe no fluxo principal
 *   como saída "nova", mas entra nos relatórios por categoria.
 * - yield: rendimento diário (CDI * %). Inserido como box_transaction apenas.
 *
 * IR regressivo (FIFO):
 *   - até 180 dias: 22,5%
 *   - 181-360: 20%
 *   - 361-720: 17,5%
 *   - > 720: 15%
 *   Aplica-se somente sobre o lucro resgatado.
 */
export class BoxService {

    static IR_TIERS = [
        { maxDays: 180, rate: 0.225 },
        { maxDays: 360, rate: 0.20 },
        { maxDays: 720, rate: 0.175 },
        { maxDays: Infinity, rate: 0.15 },
    ];

    // IOF regressivo: 96% no dia 1, -3% por dia, 0% a partir do dia 33
    static #iofRateForDays(days) {
        if (days >= 33) return 0;
        return Math.max(0, 96 - (days - 1) * 3) / 100;
    }

    // Alíquota efetiva = maior entre IOF e IR (os dois incidem sobre o rendimento,
    // mas na prática o IOF domina nos primeiros ~25 dias e o valor combinado não
    // pode ultrapassar o rendimento bruto)
    static #taxRateForDays(days) {
        return Math.max(this.#iofRateForDays(days), this.#irRateForDays(days));
    }

    // ---------- CRUD básico ----------

    static async listByUser(userId) {
        return boxRepository.findAll({ userId }, { column: 'name', ascending: true });
    }

    static async getTransactions(boxId) {
        return boxTransactionRepository.findAll(
            { boxId },
            { column: 'date', ascending: true }
        );
    }

    // ---------- Operações ----------

    static async initialDeposit({ box, userId, amount, date }) {
        return boxTransactionRepository.insert({
            userId,
            boxId: box.id,
            type: BoxTransactionModel.TYPE.DEPOSIT,
            amount,
            date,
        });
    }

    static async deposit({ box, userId, amount, date }) {
        const expense = await expenseRepository.insert({
            userId,
            title: `Depósito em ${box.name}`,
            amount,
            date,
            paymentType: PAYMENT_TYPES.BOX,
        });

        return boxTransactionRepository.insert({
            userId,
            boxId: box.id,
            type: BoxTransactionModel.TYPE.DEPOSIT,
            amount,
            date,
            expenseId: expense?.id ?? null,
        });
    }

    static async withdraw({ box, userId, amount, date }) {
        const transactions = await this.getTransactions(box.id);
        await this.#accrueYield(box, transactions, date);
        const refreshed = await this.getTransactions(box.id);

        const income = await incomeRepository.insert({
            userId,
            title: `Resgate de ${box.name}`,
            amount,
            date,
            incomeType: INCOME_TYPES.BOX,
        });

        return boxTransactionRepository.insert({
            userId,
            boxId: box.id,
            type: BoxTransactionModel.TYPE.WITHDRAW,
            amount,
            date,
            incomeId: income?.id ?? null,
        });
    }

    static async spend({ box, userId, amount, date, title, description, paymentType, benefitTypeId, categoryId, payeeId, tagIds }) {
        const expense = await expenseRepository.insert({
            userId,
            title: title || `Gasto de ${box.name}`,
            description,
            amount,
            date,
            paymentType: paymentType || PAYMENT_TYPES.DEBIT,
            benefitTypeId: benefitTypeId || null,
            categoryId,
            payeeId,
            tagIds: tagIds || null,
            boxId: box.id,
        });

        return boxTransactionRepository.insert({
            userId,
            boxId: box.id,
            type: BoxTransactionModel.TYPE.SPEND,
            amount,
            date,
            expenseId: expense?.id ?? null,
        });
    }

    // ---------- Saldos ----------

    /**
     * Saldo bruto: soma de deposits + yields - withdraws - spends.
     */
    static getGrossBalance(transactions) {
        let balance = 0;
        for (const tx of transactions) {
            if (tx.type === BoxTransactionModel.TYPE.DEPOSIT) balance += Number(tx.amount);
            else if (tx.type === BoxTransactionModel.TYPE.YIELD) balance += Number(tx.amount);
            else if (tx.type === BoxTransactionModel.TYPE.WITHDRAW) balance -= Number(tx.amount);
            else if (tx.type === BoxTransactionModel.TYPE.SPEND) balance -= Number(tx.amount);
        }
        return balance;
    }

    /**
     * Saldo líquido: saldo bruto - IR provisionado sobre o lucro não resgatado.
     * Simplificação: aplica a alíquota do lote mais antigo ainda vivo (FIFO).
     */
    static getNetBalance(transactions, today = new Date()) {
        const gross = this.getGrossBalance(transactions);
        const lots = this.#buildLots(transactions);
        let unrealizedYield = 0;
        let oldestLotDate = null;
        for (const lot of lots) {
            unrealizedYield += lot.yieldRemaining;
            if (lot.yieldRemaining > 0 && (!oldestLotDate || lot.date < oldestLotDate)) {
                oldestLotDate = lot.date;
            }
        }
        if (unrealizedYield <= 0) return gross;
        const days = oldestLotDate
            ? Math.floor((today - oldestLotDate) / 86400000)
            : 0;
        const rate = this.#taxRateForDays(days);
        return gross - unrealizedYield * rate;
    }

    // ---------- Rendimento ----------

    /**
     * Insere box_transactions do tipo yield pra cada dia útil faltante
     * desde o último yield (ou primeiro depósito) até `untilDate`.
     */
    static async accrueYieldUntil(box, untilDate = DateService.dateToSqlDate(new Date())) {
        if (box.type !== BoxModel.TYPE.NUBANK) return;
        const transactions = await this.getTransactions(box.id);
        await this.#accrueYield(box, transactions, untilDate);
    }

    /**
     * Consolida o rendimento em UMA linha por mês. Reprocessa desde o mês do
     * primeiro depósito até o mês de `untilDate`, reescrevendo o yield do mês
     * corrente toda vez que rodar (pra refletir depósitos/resgates intermediários
     * e dias úteis adicionais). Meses anteriores, se já existirem, não são recomputados.
     */
    static async #accrueYield(box, transactions, untilDate) {
        if (box.type !== BoxModel.TYPE.NUBANK) return;
        if (!transactions.length) return;

        const firstDeposit = transactions.find(t => t.type === BoxTransactionModel.TYPE.DEPOSIT);
        if (!firstDeposit) return;
        if (firstDeposit.date > untilDate) return;

        const rates = await CdiService.getRatesBetween(firstDeposit.date, untilDate);
        if (!rates.length) return;

        const multiplier = (Number(box.cdiPercentage) || 100) / 100;

        // Agrupa taxas por mês (YYYY-MM)
        const byMonth = new Map();
        for (const rate of rates) {
            const monthKey = rate.date.slice(0, 7);
            if (!byMonth.has(monthKey)) byMonth.set(monthKey, []);
            byMonth.get(monthKey).push(rate);
        }

        const currentMonthKey = untilDate.slice(0, 7);
        const monthKeys = [...byMonth.keys()].sort();

        for (const monthKey of monthKeys) {
            const existingYield = transactions.find(
                t => t.type === BoxTransactionModel.TYPE.YIELD && t.date.startsWith(monthKey)
            );
            // Mês passado já consolidado: não recomputa
            if (existingYield && monthKey !== currentMonthKey) continue;

            // Transações da caixinha, excluindo o próprio yield do mês (pra recomputar do zero)
            const baseTxs = transactions.filter(
                t => !(t.type === BoxTransactionModel.TYPE.YIELD && t.date.startsWith(monthKey))
            );

            let monthYield = 0;
            for (const rate of byMonth.get(monthKey)) {
                const txsUpToDate = baseTxs.filter(t => t.date <= rate.date);
                const balanceOnDay = this.getGrossBalance(txsUpToDate);
                if (balanceOnDay <= 0) continue;
                monthYield += balanceOnDay * Number(rate.rate) * multiplier;
            }

            const lastRateDate = byMonth.get(monthKey).at(-1).date;

            if (monthYield <= 0) {
                if (existingYield) {
                    await boxTransactionRepository.delete(existingYield.id);
                    const idx = transactions.indexOf(existingYield);
                    if (idx >= 0) transactions.splice(idx, 1);
                }
                continue;
            }

            const payload = {
                userId: box.userId,
                boxId: box.id,
                type: BoxTransactionModel.TYPE.YIELD,
                amount: monthYield,
                date: lastRateDate,
                description: `Rendimento ${(multiplier * 100).toFixed(0)}% CDI`,
            };

            if (existingYield) {
                const updated = await boxTransactionRepository.update(existingYield.id, payload);
                if (updated) Object.assign(existingYield, updated);
            } else {
                const created = await boxTransactionRepository.insert(payload);
                if (created) transactions.push(created);
            }
        }
    }

    // ---------- IR FIFO ----------

    /**
     * Constrói "lotes" FIFO a partir dos depósitos, alocando yields proporcionalmente
     * ao saldo vivo de cada lote na data do yield, e consumindo lotes no FIFO
     * quando há withdraws/spends.
     */
    static #buildLots(transactions) {
        const sorted = [...transactions].sort((a, b) => {
            if (a.date === b.date) return 0;
            return a.date < b.date ? -1 : 1;
        });
        const lots = [];
        for (const tx of sorted) {
            const amount = Number(tx.amount);
            if (tx.type === BoxTransactionModel.TYPE.DEPOSIT) {
                lots.push({
                    date: this.#parseSql(tx.date),
                    principalRemaining: amount,
                    yieldRemaining: 0,
                });
            } else if (tx.type === BoxTransactionModel.TYPE.YIELD) {
                const totalAlive = lots.reduce(
                    (s, l) => s + l.principalRemaining + l.yieldRemaining, 0
                );
                if (totalAlive <= 0) continue;
                for (const lot of lots) {
                    const share = (lot.principalRemaining + lot.yieldRemaining) / totalAlive;
                    lot.yieldRemaining += amount * share;
                }
            } else if (
                tx.type === BoxTransactionModel.TYPE.WITHDRAW
                || tx.type === BoxTransactionModel.TYPE.SPEND
            ) {
                let remaining = amount;
                for (const lot of lots) {
                    if (remaining <= 0) break;
                    const lotTotal = lot.principalRemaining + lot.yieldRemaining;
                    if (lotTotal <= 0) continue;
                    const take = Math.min(lotTotal, remaining);
                    const yieldShare = lot.yieldRemaining / lotTotal;
                    const takeYield = take * yieldShare;
                    const takePrincipal = take - takeYield;
                    lot.yieldRemaining -= takeYield;
                    lot.principalRemaining -= takePrincipal;
                    remaining -= take;
                }
            }
        }
        return lots.filter(l => l.principalRemaining + l.yieldRemaining > 0.0001);
    }

    /**
     * Simula um withdraw/spend FIFO pra calcular IR proporcional ao lucro consumido.
     */
    static #computeWithdrawIr(transactions, amount, onDate) {
        const lots = this.#buildLots(transactions);
        const today = this.#parseSql(onDate);
        let remaining = amount;
        let irAmount = 0;
        for (const lot of lots) {
            if (remaining <= 0) break;
            const lotTotal = lot.principalRemaining + lot.yieldRemaining;
            if (lotTotal <= 0) continue;
            const take = Math.min(lotTotal, remaining);
            const yieldShare = lot.yieldRemaining / lotTotal;
            const takeYield = take * yieldShare;
            const days = Math.floor((today - lot.date) / 86400000);
            const rate = this.#taxRateForDays(days);
            irAmount += takeYield * rate;
            remaining -= take;
        }
        return { netAmount: amount - irAmount, irAmount };
    }

    static #irRateForDays(days) {
        for (const tier of this.IR_TIERS) {
            if (days <= tier.maxDays) return tier.rate;
        }
        return 0.15;
    }

    static #nextDay(sqlDate) {
        const d = this.#parseSql(sqlDate);
        d.setDate(d.getDate() + 1);
        return DateService.dateToSqlDate(d);
    }

    static #parseSql(sqlDate) {
        const [y, m, d] = sqlDate.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

}
