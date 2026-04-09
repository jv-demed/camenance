export const PAYMENT_TYPES = Object.freeze({
    DEBIT: 'debit',
    PIX: 'pix',
    CREDIT: 'credit',
    BENEFITS: 'benefits',
    BOX: 'box',
    BOX_SPEND: 'box_spend',
});

export const PAYMENT_TYPES_LABELS = Object.freeze({
    [PAYMENT_TYPES.DEBIT]: 'Débito',
    [PAYMENT_TYPES.PIX]: 'Pix',
    [PAYMENT_TYPES.CREDIT]: 'Crédito',
    [PAYMENT_TYPES.BENEFITS]: 'Benefícios',
    [PAYMENT_TYPES.BOX]: 'Caixinha',
    [PAYMENT_TYPES.BOX_SPEND]: 'Gasto da Caixinha',
});

export const PAYMENT_TYPES_OPTIONS = Object.freeze(
    Object.values(PAYMENT_TYPES)
        .filter(value => value !== PAYMENT_TYPES.BOX && value !== PAYMENT_TYPES.BOX_SPEND)
        .map(value => ({
            value,
            label: PAYMENT_TYPES_LABELS[value],
        }))
);
