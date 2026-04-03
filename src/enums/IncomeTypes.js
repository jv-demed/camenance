export const INCOME_TYPES = Object.freeze({
    PIX: 'pix',
    SALARY: 'salary',
    BENEFITS: 'benefits',
});

export const INCOME_TYPES_LABELS = Object.freeze({
    [INCOME_TYPES.PIX]: 'Pix',
    [INCOME_TYPES.SALARY]: 'Salário',
    [INCOME_TYPES.BENEFITS]: 'Benefícios',
});

export const INCOME_TYPES_OPTIONS = Object.freeze(
    Object.values(INCOME_TYPES).map(value => ({
        value,
        label: INCOME_TYPES_LABELS[value],
    }))
);
