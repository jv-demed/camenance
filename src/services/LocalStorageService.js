export class LocalStorageService {

    static KEYS = Object.freeze({
        FINANCIAL_DATE_FILTER:      'financial:dateFilter',
        FINANCIAL_IS_RELATIVE:      'financial:isRelative',
        FINANCIAL_CUSTOM_DATE_RANGE:'financial:customDateRange',
        FINANCIAL_CREDIT_VIEW:      'financial:creditView',     // 'card' | 'list'
        FINANCIAL_RECURRING_VIEW:   'financial:recurringView',  // 'card' | 'list'
    });

    static get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            if (raw === null) return fallback;
            return JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            // ignora erros de quota
        }
    }

}
