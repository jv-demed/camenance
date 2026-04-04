'use client'
import { TimelineCard } from '@/screens/friendships/TimelineCard';
import { SpinLoader } from '@/components/elements/SpinLoader';

export function FriendshipTimeline({ timelineItems, loading, onRegisterEncounter }) {
    if (loading) return <SpinLoader />;

    if (timelineItems.length === 0) {
        return (
            <p className='text-gray-400 text-sm text-center py-8'>
                Nenhum amigo para mostrar na timeline. Cadastre amigos com manutenção habilitada.
            </p>
        );
    }

    return (
        <div className='flex flex-col gap-2 w-full'>
            {timelineItems.map(({ friend, daysSince, urgency }) => (
                <TimelineCard
                    key={friend.id}
                    friend={friend}
                    daysSince={daysSince}
                    urgency={urgency}
                    onRegisterEncounter={() => onRegisterEncounter(friend)}
                />
            ))}
        </div>
    );
}
