import { RECURRING_FREQUENCY, MONTH_DAY_TYPE } from '@/enums/RecurringFrequency';
import { DateService } from '@/services/DateService';

export class RecurringService {

    static generateOccurrences(record) {
        const start = this.#parseDate(record.startDate);
        if (!start) return [];

        const now = new Date();
        const limit = new Date(now.getFullYear(), now.getMonth() + 2, 0); // fim do próximo mês
        const dates = [];

        switch (record.frequency) {
            case RECURRING_FREQUENCY.DAILY: {
                const d = new Date(start);
                while (d <= limit) {
                    dates.push(new Date(d));
                    d.setDate(d.getDate() + 1);
                }
                break;
            }
            case RECURRING_FREQUENCY.WEEKLY: {
                const target = record.dayOfWeek ?? 1;
                const d = new Date(start);
                while (d.getDay() !== target) d.setDate(d.getDate() + 1);
                while (d <= limit) {
                    dates.push(new Date(d));
                    d.setDate(d.getDate() + 7);
                }
                break;
            }
            case RECURRING_FREQUENCY.MONTHLY: {
                const startMonth = start.getMonth();
                const startYear = start.getFullYear();
                const endMonth = limit.getMonth();
                const endYear = limit.getFullYear();
                for (let y = startYear; y <= endYear; y++) {
                    const mStart = y === startYear ? startMonth : 0;
                    const mEnd = y === endYear ? endMonth : 11;
                    for (let m = mStart; m <= mEnd; m++) {
                        const date = this.resolveMonthDay(y, m, record.dayOfMonth);
                        if (date && date >= start && date <= limit) {
                            dates.push(date);
                        }
                    }
                }
                break;
            }
            case RECURRING_FREQUENCY.YEARLY: {
                let y = start.getFullYear();
                while (y <= limit.getFullYear()) {
                    const date = new Date(y, start.getMonth(), start.getDate());
                    if (date >= start && date <= limit) dates.push(date);
                    y++;
                }
                break;
            }
        }

        return dates.map(d => {
            const sqlDate = DateService.dateToSqlDate(d);
            const realized = record.realizedDates?.includes(sqlDate);
            const skipped = record.skippedDates?.includes(sqlDate);
            return {
                record,
                date: d,
                sqlDate,
                status: realized ? 'realized' : skipped ? 'skipped' : 'pending',
            };
        });
    }

    static resolveMonthDay(year, month, dayOfMonth) {
        if (dayOfMonth === MONTH_DAY_TYPE.FIRST_BUSINESS_DAY) {
            return this.#getNthBusinessDay(year, month, 1);
        }
        if (dayOfMonth === MONTH_DAY_TYPE.FIFTH_BUSINESS_DAY) {
            return this.#getNthBusinessDay(year, month, 5);
        }
        if (dayOfMonth === MONTH_DAY_TYPE.LAST_DAY) {
            return new Date(year, month + 1, 0);
        }
        const day = parseInt(dayOfMonth, 10);
        if (!day || day < 1) return null;
        const lastDay = new Date(year, month + 1, 0).getDate();
        return new Date(year, month, Math.min(day, lastDay));
    }

    static #getNthBusinessDay(year, month, n) {
        let count = 0;
        const d = new Date(year, month, 1);
        while (d.getMonth() === month) {
            if (d.getDay() >= 1 && d.getDay() <= 5) {
                count++;
                if (count === n) return new Date(d);
            }
            d.setDate(d.getDate() + 1);
        }
        return null;
    }

    static #parseDate(sqlDate) {
        if (!sqlDate) return null;
        const [y, m, d] = sqlDate.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

}
