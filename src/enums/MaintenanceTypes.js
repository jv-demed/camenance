export const MAINTENANCE = Object.freeze({
    NO_MAINTENANCE: 'no_maintenance',
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
});

export const MAINTENANCE_LABELS = Object.freeze({
    [MAINTENANCE.NO_MAINTENANCE]: 'Sem manutenção',
    [MAINTENANCE.LOW]: 'Baixa',
    [MAINTENANCE.MEDIUM]: 'Média',
    [MAINTENANCE.HIGH]: 'Alta',
});

// Frequência ideal em dias para cada nível
export const MAINTENANCE_FREQUENCY_DAYS = Object.freeze({
    [MAINTENANCE.NO_MAINTENANCE]: null, // não aparece na timeline
    [MAINTENANCE.LOW]: 90,
    [MAINTENANCE.MEDIUM]: 30,
    [MAINTENANCE.HIGH]: 14,
});

// Peso multiplicador para o score de priorização
export const MAINTENANCE_WEIGHTS = Object.freeze({
    [MAINTENANCE.NO_MAINTENANCE]: 0,
    [MAINTENANCE.LOW]: 1,
    [MAINTENANCE.MEDIUM]: 2,
    [MAINTENANCE.HIGH]: 3,
});

export const MAINTENANCE_OPTIONS = Object.freeze(
    Object.values(MAINTENANCE).map(value => ({
        value,
        label: MAINTENANCE_LABELS[value],
    }))
);
