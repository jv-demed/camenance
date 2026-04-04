export const FRIENDSHIP_LEVEL = Object.freeze({
    FRIEND: 'friend',
    GREAT_FRIEND: 'great_friend',
    BEST_FRIEND: 'best_friend',
});

export const FRIENDSHIP_LEVEL_LABELS = Object.freeze({
    [FRIENDSHIP_LEVEL.FRIEND]: 'Amigo',
    [FRIENDSHIP_LEVEL.GREAT_FRIEND]: 'Grande amigo',
    [FRIENDSHIP_LEVEL.BEST_FRIEND]: 'Melhor amigo',
});

export const FRIENDSHIP_LEVEL_WEIGHTS = Object.freeze({
    [FRIENDSHIP_LEVEL.FRIEND]: 1.0,
    [FRIENDSHIP_LEVEL.GREAT_FRIEND]: 1.5,
    [FRIENDSHIP_LEVEL.BEST_FRIEND]: 2.0,
});

export const FRIENDSHIP_LEVEL_OPTIONS = Object.freeze(
    Object.values(FRIENDSHIP_LEVEL).map(value => ({
        value,
        label: FRIENDSHIP_LEVEL_LABELS[value],
    }))
);
