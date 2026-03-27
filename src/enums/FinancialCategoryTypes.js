export const FINANCIAL_CATEGORY_TYPES = Object.freeze({
    EXPENSE: 'expense',
    INCOME:  'income',
});

export const FINANCIAL_CATEGORY_TYPES_LABELS = Object.freeze({
    [FINANCIAL_CATEGORY_TYPES.EXPENSE]: 'Despesa',
    [FINANCIAL_CATEGORY_TYPES.INCOME]:  'Receita',
});

export const FINANCIAL_CATEGORY_TYPES_OPTIONS = Object.freeze(
    Object.values(FINANCIAL_CATEGORY_TYPES).map(value => ({
        value,
        label: FINANCIAL_CATEGORY_TYPES_LABELS[value],
    }))
);
