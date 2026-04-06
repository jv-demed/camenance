'use client'
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useDataList } from '@/hooks/useDataList';
import { friendRepository } from '@/repositories/FriendRepository';
import { encounterRepository } from '@/repositories/EncounterRepository';
import { encounterPhotoRepository } from '@/repositories/EncounterPhotoRepository';
import { locationRepository } from '@/repositories/LocationRepository';
import { FriendshipService } from '@/services/FriendshipService';
import { Main } from '@/components/containers/Main';
import { PageHeader } from '@/components/elements/PageHeader';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { ICONS } from '@/assets/icons';
import { FriendsList } from '@/screens/friendships/FriendsList';
import { FriendModal } from '@/screens/friendships/FriendModal';
import { FriendshipTimeline } from '@/screens/friendships/FriendshipTimeline';
import { FriendPriorityBoxes } from '@/screens/friendships/FriendPriorityBoxes';
import { EncounterModal } from '@/screens/friendships/EncounterModal';

const TABS = [
    { key: 'timeline', label: 'Timeline' },
    { key: 'friends', label: 'Meus amigos' },
];

export function Friendships() {

    const { user } = useUser();

    const friends = useDataList({
        repository: friendRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id },
    });

    const encounters = useDataList({
        repository: encounterRepository,
        order: { column: 'date', ascending: false },
        filters: { userId: user.id },
    });

    const locations = useDataList({
        repository: locationRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id },
    });

    const photos = useDataList({
        repository: encounterPhotoRepository,
        filters: { userId: user.id },
    });

    const photosByEncounter = useMemo(() => {
        const map = {};
        photos.list.forEach(p => {
            if (!map[p.encounterId]) map[p.encounterId] = [];
            map[p.encounterId].push(p);
        });
        return map;
    }, [photos.list]);

    const isLoading = friends.loading || encounters.loading;

    // Agrupa encontros por amigo para o algoritmo
    const encountersByFriend = useMemo(() => {
        const map = {};
        encounters.list.forEach(enc => {
            (enc.friendIds || []).forEach(fid => {
                if (!map[fid]) map[fid] = [];
                map[fid].push(enc);
            });
        });
        return map;
    }, [encounters.list]);

    const timelineItems = useMemo(() => {
        return FriendshipService.sortForTimeline(friends.list, encountersByFriend);
    }, [friends.list, encountersByFriend]);

    const [activeTab, setActiveTab] = useState('timeline');

    // Estado do modal de amigo
    const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);
    const [friendRecord, setFriendRecord] = useState({});

    const getTodayLocal = () => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().split('T')[0];
    };

    function openNewFriend() {
        setFriendRecord({});
        setIsFriendModalOpen(true);
    }

    function openEditFriend(friend) {
        setFriendRecord({ ...friend });
        setIsFriendModalOpen(true);
    }

    function closeFriendModal() {
        setIsFriendModalOpen(false);
        setFriendRecord({});
    }

    // Estado do modal de encontro
    const [isEncounterModalOpen, setIsEncounterModalOpen] = useState(false);
    const [encounterRecord, setEncounterRecord] = useState({});
    const [preselectedFriend, setPreselectedFriend] = useState(null);

    function openNewEncounter(friend = null) {
        setEncounterRecord({ date: getTodayLocal() });
        setPreselectedFriend(friend);
        setIsEncounterModalOpen(true);
    }

    function openEditEncounter(encounter) {
        setEncounterRecord({ ...encounter });
        setPreselectedFriend(null);
        setIsEncounterModalOpen(true);
    }

    function closeEncounterModal() {
        setIsEncounterModalOpen(false);
        setEncounterRecord({});
        setPreselectedFriend(null);
    }

    return (
        <Main>
            {isLoading ? <SpinLoader /> : (
                <div className='flex flex-col gap-3 w-full h-screen max-h-screen overflow-hidden'>
                    <PageHeader title='Amizades' />

                    {/* Abas e Ações */}
                    <div className='flex items-center justify-between border-b border-white/15 pb-2'>
                        {/* Abas */}
                        <div className='flex gap-1'>
                            {TABS.map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`
                                        px-4 py-1.5 rounded-lg text-sm transition-all duration-200
                                        ${activeTab === tab.key
                                            ? 'bg-white text-gray-700 font-semibold shadow-sm'
                                            : 'text-gray-400 hover:text-white'
                                        }
                                    `}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Ações (botão do lado direito) */}
                        <div className="flex-shrink-0">
                            {activeTab === 'timeline' ? (
                                <DefaultBtn
                                    text='Novo rolê'
                                    icon={ICONS.add}
                                    width='160px'
                                    onClick={() => openNewEncounter()}
                                />
                            ) : (
                                <DefaultBtn
                                    text='Novo amigo'
                                    icon={ICONS.add}
                                    width='160px'
                                    onClick={() => openNewFriend()}
                                />
                            )}
                        </div>
                    </div>

                    {/* Conteúdo da aba */}
                    <div className='flex-1 overflow-hidden pb-4'>
                        {activeTab === 'timeline' && (
                            <div className='flex gap-12 h-full'>
                                <FriendPriorityBoxes
                                    timelineItems={timelineItems}
                                    onRegisterEncounter={openNewEncounter}
                                />
                                <div className='flex-1 overflow-y-auto pr-4'>
                                    <FriendshipTimeline
                                        encounters={encounters.list}
                                        friends={friends.list}
                                        photosByEncounter={photosByEncounter}
                                        loading={false}
                                        onEditEncounter={openEditEncounter}
                                    />
                                </div>
                            </div>
                        )}
                        {activeTab === 'friends' && (
                            <div className='overflow-y-auto h-full pr-4 pl-1'>
                                <FriendsList
                                    friends={friends.list}
                                    onEdit={openEditFriend}
                                    onRegisterEncounter={openNewEncounter}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <FriendModal
                isOpen={isFriendModalOpen}
                onClose={closeFriendModal}
                record={friendRecord}
                setRecord={setFriendRecord}
                friendsRefresh={friends.refresh}
                user={user}
            />

            <EncounterModal
                isOpen={isEncounterModalOpen}
                onClose={closeEncounterModal}
                record={encounterRecord}
                setRecord={setEncounterRecord}
                preselectedFriend={preselectedFriend}
                friends={friends.list}
                locations={locations}
                locationsRefresh={locations.refresh}
                encountersRefresh={encounters.refresh}
                photosRefresh={photos.refresh}
                user={user}
            />
        </Main>
    );
}
