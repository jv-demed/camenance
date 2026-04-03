export const PAYMENT_TYPES = Object.freeze({
    DEBIT: 'debit',
    PIX: 'pix',
    CREDIT: 'credit',
});

export const PAYMENT_TYPES_LABELS = Object.freeze({
    [PAYMENT_TYPES.DEBIT]: 'Débito',
    [PAYMENT_TYPES.PIX]: 'Pix',
    [PAYMENT_TYPES.CREDIT]: 'Crédito',
});

export const PAYMENT_TYPES_OPTIONS = Object.freeze(
    Object.values(PAYMENT_TYPES).map(value => ({
        value,
        label: PAYMENT_TYPES_LABELS[value],
    }))
);
