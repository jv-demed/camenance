'use client'
import { useState } from 'react';
import { ICONS } from '@/assets/icons';
import { creditCardRepository } from '@/repositories/CreditCardRepository';
import { CreditCardModel } from '@/models/CreditCardModel';
import { AlertService } from '@/services/alertService';
import { TextInput } from '@/components/inputs/TextInput';
import { NumberInput } from '@/components/inputs/NumberInput';
import { ColorInput } from '@/components/inputs/ColorInput';
import { IconBtn } from '@/components/buttons/IconBtn';
import { SearchBar } from '@/components/inputs/SearchBar';

export function CreditCardsSection({ creditCards, user }) {

    const [newCard, setNewCard] = useState({ name: '', closingDay: 1, dueDay: 1, color: '#3b82f6' });
    const [search, setSearch] = useState('');

    const [editingId, setEditingId] = useState(null);
    const [editCard, setEditCard] = useState({});

    function startEdit(card) {
        setEditingId(card.id);
        setEditCard({ ...card });
    }

    function cancelEdit() {
        setEditingId(null);
        setEditCard({});
    }

    async function handleAdd() {
        if (!newCard.name.trim() || !newCard.closingDay || !newCard.dueDay) return;
        try {
            const model = new CreditCardModel({
                name: newCard.name.trim(),
                closingDay: parseInt(newCard.closingDay),
                dueDay: parseInt(newCard.dueDay),
                color: newCard.color,
                userId: user.id
            });
            await creditCardRepository.insert(model);
            creditCards.refresh();
            setNewCard({ name: '', closingDay: 1, dueDay: 1, color: '#3b82f6' });
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleSave(id) {
        if (!editCard.name.trim() || !editCard.closingDay || !editCard.dueDay) return;
        try {
            const model = new CreditCardModel({
                name: editCard.name.trim(),
                closingDay: parseInt(editCard.closingDay),
                dueDay: parseInt(editCard.dueDay),
                color: editCard.color
            });
            await creditCardRepository.update(id, model);
            creditCards.refresh();
            cancelEdit();
            AlertService.fastSuccess();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    async function handleDelete(id) {
        try {
            await creditCardRepository.delete(id);
            creditCards.refresh();
        } catch(e) {
            AlertService.error(e.message);
        }
    }

    const filtered = creditCards?.list?.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className='flex flex-col gap-4'>
            {/* Seção de Adição */}
            <div className='flex gap-3 items-center'>
                <div className='flex-1 flex flex-col gap-1'>
                    <div className='flex gap-3'>
                        <div className='flex-1'>
                            <TextInput
                                placeholder='Nome do cartão'
                                value={newCard.name}
                                setValue={e => setNewCard({ ...newCard, name: e })}
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <ColorInput
                                value={newCard.color}
                                setValue={e => setNewCard({ ...newCard, color: e })}
                                width='50px'
                            />
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <div className='flex-1'>
                            <label className='text-xs text-gray-500 font-medium block mb-1'>Dia de Fechamento</label>
                            <NumberInput
                                placeholder='Ex: 10'
                                value={newCard.closingDay}
                                setValue={e => setNewCard({ ...newCard, closingDay: e })}
                                min={1}
                                max={31}
                            />
                        </div>
                        <div className='flex-1'>
                            <label className='text-xs text-gray-500 font-medium block mb-1'>Dia de Vencimento</label>
                            <NumberInput
                                placeholder='Ex: 15'
                                value={newCard.dueDay}
                                setValue={e => setNewCard({ ...newCard, dueDay: e })}
                                min={1}
                                max={31}
                            />
                        </div>
                    </div>
                </div>
                <div className='flex items-end'>
                    <IconBtn icon={ICONS.add} text='Adicionar cartão' onClick={handleAdd} />
                </div>
            </div>

            {/* Seção de Listagem */}
            <div className='flex flex-col gap-2'>
                <SearchBar value={search} setValue={setSearch} />

                {creditCards?.list?.length === 0 && (
                    <span className='text-sm text-gray-400 px-3 py-2'>Nenhum cartão cadastrado.</span>
                )}

                {filtered?.map(card => (
                    <div key={card.id} className='p-2 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors space-y-2'>
                        {editingId === card.id ? (
                            <div className='flex gap-3 items-center'>
                                <div className='flex-1 flex flex-col gap-1'>
                                    <div className='flex gap-3'>
                                        <div className='flex-1'>
                                            <TextInput
                                                value={editCard.name}
                                                setValue={e => setEditCard({ ...editCard, name: e })}
                                            />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <ColorInput
                                                value={editCard.color}
                                                setValue={e => setEditCard({ ...editCard, color: e })}
                                                width='50px'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex gap-3'>
                                        <div className='flex-1'>
                                            <label className='text-xs text-gray-500 font-medium block mb-1'>Dia de Fechamento</label>
                                            <NumberInput
                                                placeholder='Ex: 10'
                                                value={editCard.closingDay}
                                                setValue={e => setEditCard({ ...editCard, closingDay: e })}
                                                min={1}
                                                max={31}
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <label className='text-xs text-gray-500 font-medium block mb-1'>Dia de Vencimento</label>
                                            <NumberInput
                                                placeholder='Ex: 15'
                                                value={editCard.dueDay}
                                                setValue={e => setEditCard({ ...editCard, dueDay: e })}
                                                min={1}
                                                max={31}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-end gap-1'>
                                    <IconBtn icon={ICONS.check} color='text-primary' size='text-base' onClick={() => handleSave(card.id)} />
                                    <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={cancelEdit} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-start gap-3 flex-1 min-w-0'>
                                        <div
                                            className='w-8 h-8 rounded-lg flex-shrink-0 border border-gray-200'
                                            style={{ backgroundColor: card.color }}
                                            title={card.name}
                                        />
                                        <div className='min-w-0 flex-1'>
                                            <p className='font-medium text-sm'>{card.name}</p>
                                            <div className='flex gap-4 text-xs text-gray-500 mt-1'>
                                                <div className='flex gap-1'>
                                                    <p className='text-gray-400'>Fecha:</p>
                                                    <p className='font-medium text-gray-700'>{card.closingDay}</p>
                                                </div>
                                                <div className='flex gap-1'>
                                                    <p className='text-gray-400'>Vence:</p>
                                                    <p className='font-medium text-gray-700'>{card.dueDay}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex gap-1 flex-shrink-0'>
                                        <IconBtn icon={ICONS.edit} color='text-gray-400' size='text-base' onClick={() => startEdit(card)} />
                                        <IconBtn icon={ICONS.close} color='text-gray-400' size='text-base' onClick={() => handleDelete(card.id)} />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
