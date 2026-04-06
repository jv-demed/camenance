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

// Frequência base em dias por nível de manutenção (para melhor amigo).
// O valor final é multiplicado pelo FRIENDSHIP_LEVEL_FREQ_MULTIPLIER do amigo.
// Range: 4.5× (Alta=30 → Baixa=135), garantindo mais peso que a amizade (range 2×).
export const MAINTENANCE_BASE_FREQUENCY = Object.freeze({
    [MAINTENANCE.NO_MAINTENANCE]: null, // não aparece na timeline
    [MAINTENANCE.LOW]: 135,
    [MAINTENANCE.MEDIUM]: 75,
    [MAINTENANCE.HIGH]: 30,
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
