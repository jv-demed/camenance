import { useState, useEffect, useCallback } from 'react';
import { useFinancial } from '@/contexts/FinancialContext';
import { ICONS } from '@/assets/icons';
import { AlertService } from '@/services/AlertService';
import { BoxService } from '@/services/BoxService';
import { DateService } from '@/services/DateService';
import { BoxModel } from '@/models/BoxModel';
import { useDataList } from '@/hooks/useDataList';
import { boxRepository } from '@/repositories/BoxRepository';
import { boxTransactionRepository } from '@/repositories/BoxTransactionRepository';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { SpinLoader } from '@/components/elements/SpinLoader';
import { BoxCard } from './BoxCard';
import { BoxDetail } from './BoxDetail';
import { BoxFormModal } from './BoxFormModal';
import { BoxTransactionModal } from './BoxTransactionModal';

const emptyBox = {
    name: '',
    description: '',
    color: '#7c3aed',
    type: BoxModel.TYPE.SIMPLE,
    cdiPercentage: null,
    initialBalance: 0,
};

const emptyTx = {
    title: '',
    description: '',
    amount: 0,
    date: DateService.dateToSqlDate(new Date()),
    paymentType: null,
    benefitTypeId: null,
    payeeId: null,
    categoryId: null,
    tagIds: [],
};

export function BoxesList() {
    const { user, payees, categories, tags, benefitTypes, expensesRefresh, incomesRefresh } = useFinancial();
    const boxes = useDataList({
        repository: boxRepository,
        order: { column: 'name', ascending: true },
        filters: { userId: user.id },
    });

    const allTransactions = useDataList({
        repository: boxTransactionRepository,
        order: { column: 'date', ascending: true },
        filters: { userId: user.id },
    });

    const [search, setSearch] = useState('');
    const [selectedBox, setSelectedBox] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formRecord, setFormRecord] = useState(emptyBox);

    const [txMode, setTxMode] = useState(null);
    const [txRecord, setTxRecord] = useState(emptyTx);

    const refreshAll = useCallback(() => {
        boxes.refresh?.();
        allTransactions.refresh?.();
        expensesRefresh?.();
        incomesRefresh?.();
    }, [boxes, allTransactions, expensesRefresh, incomesRefresh]);

    // Rendimento lazy: quando abrir uma caixinha Nubank, atualiza yields
    useEffect(() => {
        if (!selectedBox) return;
        if (selectedBox.type !== BoxModel.TYPE.NUBANK) return;
        (async () => {
            try {
                await BoxService.accrueYieldUntil(selectedBox);
                allTransactions.refresh?.();
            } catch (e) {
                AlertService.error(`Falha ao atualizar rendimento: ${e.message}`);
            }
        })();
    }, [selectedBox?.id]);

    function openNew() {
        setFormRecord({ ...emptyBox });
        setIsFormOpen(true);
    }

    function openEdit(box) {
        setFormRecord({ ...box });
        setIsFormOpen(true);
    }

    function openTxModal(mode) {
        setTxRecord({ ...emptyTx, date: DateService.dateToSqlDate(new Date()) });
        setTxMode(mode);
    }

    if (boxes.loading || allTransactions.loading) return <SpinLoader />;

    const filteredBoxes = (boxes.list || []).filter(b =>
        !search || b.name.toLowerCase().includes(search.toLowerCase())
    );

    const txsForSelected = selectedBox
        ? (allTransactions.list || []).filter(t => t.boxId === selectedBox.id)
        : [];

    const liveSelectedBox = selectedBox
        ? (boxes.list || []).find(b => b.id === selectedBox.id) || selectedBox
        : null;

    return (
        <>
            {liveSelectedBox ? (
                <BoxDetail
                    box={liveSelectedBox}
                    transactions={txsForSelected}
                    onBack={() => setSelectedBox(null)}
                    onAction={openTxModal}
                />
            ) : (
                <>
                    <div className='flex gap-1'>
                        <TextInput placeholder='Buscar...' value={search} setValue={setSearch} />
                        <DefaultBtn width='50px' icon={ICONS.add} onClick={openNew} />
                    </div>
                    <ul className='
                        grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5
                        overflow-x-hidden overflow-y-auto
                        [&::-webkit-scrollbar]:w-1.5
                        [&::-webkit-scrollbar-thumb]:bg-gray-400/50
                        [&::-webkit-scrollbar-thumb]:rounded-md
                    '>
                        {filteredBoxes.length === 0 ? (
                            <li className='col-span-full flex flex-col items-center gap-2 py-8 text-gray-400'>
                                <ICONS.finances size={36} />
                                <span className='text-sm'>Nenhuma caixinha</span>
                            </li>
                        ) : filteredBoxes.map(box => (
                            <li key={box.id}>
                                <BoxCard
                                    box={box}
                                    transactions={(allTransactions.list || []).filter(t => t.boxId === box.id)}
                                    onOpen={setSelectedBox}
                                    onEdit={openEdit}
                                />
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <BoxFormModal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                record={formRecord}
                setRecord={setFormRecord}
                refresh={boxes.refresh}
                user={user}
            />

            <BoxTransactionModal
                isOpen={!!txMode}
                mode={txMode}
                onClose={() => setTxMode(null)}
                box={liveSelectedBox}
                user={user}
                payees={payees}
                categories={categories}
                tags={tags}
                benefitTypes={benefitTypes}
                refresh={refreshAll}
                record={txRecord}
                setRecord={setTxRecord}
            />
        </>
    );
}
