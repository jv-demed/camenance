import { MAINTENANCE, MAINTENANCE_BASE_FREQUENCY, MAINTENANCE_WEIGHTS } from '@/enums/MaintenanceTypes';
import { FRIENDSHIP_LEVEL_FREQ_MULTIPLIER, FRIENDSHIP_LEVEL_WEIGHTS } from '@/enums/FriendshipLevelTypes';

export const URGENCY_STATUS = Object.freeze({
    OVERDUE: 'overdue',
    SOON: 'soon',
    OK: 'ok',
});

export const URGENCY_COLORS = Object.freeze({
    [URGENCY_STATUS.OVERDUE]: '#ef4444',
    [URGENCY_STATUS.SOON]: '#f59e0b',
    [URGENCY_STATUS.OK]: '#22c55e',
});

export const FriendshipService = {

    /**
     * Calcula quantos dias se passaram desde a data de referência.
     */
    _daysSince(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return Math.max(0, Math.floor((today - date) / (1000 * 60 * 60 * 24)));
    },

    /**
     * Calcula quantos dias se passaram desde o último encontro.
     * Se não houver encontros, usa createdAt do amigo como referência
     * (amigo recém-cadastrado = urgência zero).
     */
    daysSinceLastEncounter(encounters, friendCreatedAt) {
        if (encounters && encounters.length > 0) {
            const latest = encounters.reduce((a, b) => (a.date > b.date ? a : b));
            return FriendshipService._daysSince(latest.date);
        }
        if (friendCreatedAt) {
            return FriendshipService._daysSince(friendCreatedAt);
        }
        return 0;
    },

    /**
     * Calcula o score composto de priorização.
     * Amigos sem manutenção retornam null (não entram na timeline).
     */
    computeScore(friend, daysSince) {
        if (friend.maintenance === MAINTENANCE.NO_MAINTENANCE) return null;

        const days = daysSince ?? 0;
        const maintenanceWeight = MAINTENANCE_WEIGHTS[friend.maintenance] ?? 1;
        const friendshipWeight = FRIENDSHIP_LEVEL_WEIGHTS[friend.friendshipLevel] ?? 1;

        return (days / 30) * maintenanceWeight * friendshipWeight;
    },

    /**
     * Classifica a urgência com base nos dias e na frequência ideal.
     */
    getUrgencyStatus(friend, daysSince) {
        if (friend.maintenance === MAINTENANCE.NO_MAINTENANCE) return null;

        const baseFreq = MAINTENANCE_BASE_FREQUENCY[friend.maintenance];
        const freqMultiplier = FRIENDSHIP_LEVEL_FREQ_MULTIPLIER[friend.friendshipLevel] ?? 1;
        const frequency = Math.round(baseFreq * freqMultiplier);
        const days = daysSince ?? 0;
        const ratio = days / frequency;

        if (ratio >= 1.0) return URGENCY_STATUS.OVERDUE;
        if (ratio >= 0.7) return URGENCY_STATUS.SOON;
        return URGENCY_STATUS.OK;
    },

    /**
     * Ordena amigos para a timeline:
     * - Exclui amigos com no_maintenance
     * - Ordena por score decrescente
     */
    sortForTimeline(friends, encountersByFriend) {
        return friends
            .filter(f => f.maintenance !== MAINTENANCE.NO_MAINTENANCE)
            .map(friend => {
                const encounters = encountersByFriend[friend.id] ?? [];
                const daysSince = FriendshipService.daysSinceLastEncounter(encounters, friend.createdAt);
                const score = FriendshipService.computeScore(friend, daysSince);
                const urgency = FriendshipService.getUrgencyStatus(friend, daysSince);
                return { friend, daysSince, score, urgency };
            })
            .sort((a, b) => b.score - a.score);
    },

};
