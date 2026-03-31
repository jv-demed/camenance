'use client'
import { useEffect, useState } from 'react';
import { DateService } from '@/services/DateService';
import { ICONS } from '@/assets/icons';
import { TextInput } from '@/components/inputs/TextInput';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { TransactionCard } from '@/screens/financial/TransactionCard';
import { TransactionModal } from '@/screens/financial/TransactionModal';

export function TransactionList({
    expenses,
    incomes,
    payees,
    sources,
    categories,
    tags,
    creditCards,
    expensesRefresh,
    incomesRefresh,
    user
}) {

    const mergedList = [
        ...expenses.map(e => ({ ...e, _isIncome: false })),
        ...incomes.map(i => ({ ...i, _isIncome: true }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    const [copyList, setCopyList] = useState(mergedList);
    useEffect(() => {
        setCopyList(mergedList);
    }, [expenses, incomes]);

    const [search, setSearch] = useState('');
    useEffect(() => {
        const filteredList = mergedList.filter(e =>
            e.title.toLowerCase().includes(search.toLowerCase())
        );
        setCopyList(filteredList);
    }, [search, expenses, incomes]);

    const recordObj = {
        amount: 0,
        date: DateService.dateToSqlDate(new Date()),
        description: '',
        categoryId: null,
        tagIds: [],
        payeeId: null,
        sourceId: null,
        title: ''
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRecord, setNewRecord] = useState(recordObj);

    return (
        <div className={`
            flex flex-col gap-2
            w-[500px]
        `}>
            <div className='flex gap-1'>
                <TextInput
                    placeholder='Buscar...'
                    value={search}
                    setValue={setSearch}
                />
                <DefaultBtn
                    width='50px'
                    icon={ICONS.add}
                    onClick={() => setIsModalOpen(true)}
                />
            </div>
            <ul className={`
                flex flex-col gap-2 p-1.5
                overflow-x-hidden overflow-y-auto
                [&::-webkit-scrollbar]:w-1.5
                [&::-webkit-scrollbar-track]:white
                [&::-webkit-scrollbar-track]:rounded-md
                [&::-webkit-scrollbar-thumb]:bg-gray-400/50
                [&::-webkit-scrollbar-thumb]:rounded-md
                [&::-webkit-scrollbar-thumb:hover]:bg-gray-400/80
            `}
            >
                {copyList.length === 0 ? (
                    <li className='flex flex-col items-center gap-2 py-8 text-gray-400'>
                        <ICONS.finances size={36} />
                        <span className='text-sm'>
                            {search
                                ? 'Nenhuma movimentação encontrada'
                                : 'Nenhuma movimentação cadastrada'
                            }
                        </span>
                    </li>
                ) : copyList.map(record => (
                    <li key={`${record._isIncome ? 'income' : 'expense'}-${record.id}`}>
                        <TransactionCard
                            record={record}
                            payees={payees}
                            sources={sources}
                            categories={categories}
                            tags={tags}
                            user={user}
                            refresh={record._isIncome ? incomesRefresh : expensesRefresh}
                        />
                    </li>
                ))}
            </ul>
            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => { setIsModalOpen(false); setNewRecord(recordObj); }}
                record={newRecord}
                setRecord={setNewRecord}
                expensesRefresh={expensesRefresh}
                incomesRefresh={incomesRefresh}
                payees={payees}
                sources={sources}
                categories={categories}
                tags={tags}
                creditCards={creditCards}
                user={user}
            />
        </div>
    );
}
