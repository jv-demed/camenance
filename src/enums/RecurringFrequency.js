export const RECURRING_FREQUENCY = Object.freeze({
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
});

export const RECURRING_FREQUENCY_LABELS = Object.freeze({
    [RECURRING_FREQUENCY.DAILY]: 'Diário',
    [RECURRING_FREQUENCY.WEEKLY]: 'Semanal',
    [RECURRING_FREQUENCY.MONTHLY]: 'Mensal',
    [RECURRING_FREQUENCY.YEARLY]: 'Anual',
});

export const RECURRING_FREQUENCY_OPTIONS = Object.freeze(
    Object.values(RECURRING_FREQUENCY).map(value => ({
        value,
        label: RECURRING_FREQUENCY_LABELS[value],
    }))
);

export const MONTH_DAY_TYPE = Object.freeze({
    FIRST_BUSINESS_DAY: 'first_business_day',
    FIFTH_BUSINESS_DAY: 'fifth_business_day',
    LAST_DAY: 'last_day',
});

export const MONTH_DAY_OPTIONS = Object.freeze([
    { value: MONTH_DAY_TYPE.FIRST_BUSINESS_DAY, label: '1º dia útil' },
    { value: MONTH_DAY_TYPE.FIFTH_BUSINESS_DAY, label: '5º dia útil' },
    { value: MONTH_DAY_TYPE.LAST_DAY, label: 'Último dia' },
    ...Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1),
        label: `Dia ${i + 1}`,
    })),
]);

export const DAYS_OF_WEEK_OPTIONS = Object.freeze([
    { value: 0, label: 'Domingo' },
    { value: 1, label: 'Segunda-feira' },
    { value: 2, label: 'Terça-feira' },
    { value: 3, label: 'Quarta-feira' },
    { value: 4, label: 'Quinta-feira' },
    { value: 5, label: 'Sexta-feira' },
    { value: 6, label: 'Sábado' },
]);
