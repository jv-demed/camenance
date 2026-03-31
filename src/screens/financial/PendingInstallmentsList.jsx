import { useState, useMemo } from 'react';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { ExpenseModel } from '@/models/ExpenseModel';
import { CreditCardService } from '@/services/CreditCardService';
import { DateService } from '@/services/DateService';
import { MonetaryService } from '@/services/monetaryService';
import { AlertService } from '@/services/alertService';
import { PAYMENT_TYPES } from '@/enums/PaymentTypes';
import { ICONS } from '@/assets/icons';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { InstallmentPurchaseModal } from '@/screens/financial/InstallmentPurchaseModal';

const emptyPurchase = {
    title: '',
    description: '',
    totalAmount: 0,
    installmentTotal: 2,
    creditCardId: null,
    payeeId: null,
    categoryId: null,
    tagIds: [],
    startDate: DateService.dateToSqlDate(new Date())
};

export function PendingInstallmentsList({
    installmentPurchases,
    expenses,
    payees,
    categories,
    tags,
    creditCards,
    user,
    installmentPurchasesRefresh,
    expensesRefresh
}) {

    const pendingInstallments = useMemo(() => {
        const result = [];
        for (const purchase of installmentPurchases.list) {
            const card = creditCards.list.find(c => c.id === purchase.creditCardId);
            const installmentAmount = purchase.totalAmount / purchase.installmentTotal;
            for (let i = 1; i <= purchase.installmentTotal; i++) {
                const isPaid = expenses.some(
                    e => e.installmentGroupId === purchase.id && e.installmentNumber === i
                );
                if (isPaid) continue;
                const dueDate = card
                    ? CreditCardService.calculateDueDate(card, purchase.startDate, i)
                    : null;
                result.push({ purchase, installmentNumber: i, installmentAmount, dueDate });
            }
        }
        return result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate - b.dueDate;
        });
    }, [installmentPurchases.list, expenses, creditCards.list]);

    async function handlePay(purchase, installmentNumber, installmentAmount) {
        try {
            const model = new ExpenseModel({
                title: `${purchase.title} ${installmentNumber}/${purchase.installmentTotal}`,
                amount: installmentAmount,
                date: DateService.dateToSqlDate(new Date()),
                description: purchase.description || '',
                payeeId: purchase.payeeId,
                categoryId: purchase.categoryId,
                tagIds: purchase.tagIds || [],
                paymentType: PAYMENT_TYPES.CREDIT,
                creditCardId: purchase.creditCardId,
                installmentGroupId: purchase.id,
                installmentNumber: installmentNumber,
                installmentTotal: purchase.installmentTotal,
                userId: user.id
            });
            await expenseRepository.insert(model);
            expensesRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        }
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRecord, setModalRecord] = useState(emptyPurchase);

    function openNew() {
        setModalRecord({ ...emptyPurchase, startDate: DateService.dateToSqlDate(new Date()) });
        setIsModalOpen(true);
    }

    function openEdit(purchase) {
        setModalRecord(purchase);
        setIsModalOpen(true);
    }

    function getPaidCount(purchaseId) {
        return expenses.filter(e => e.installmentGroupId === purchaseId).length;
    }

    return (
        <>
            <div className='flex justify-end'>
                <DefaultBtn width='50px' icon={ICONS.add} onClick={openNew} />
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
            `}>
                {pendingInstallments.length === 0 ? (
                    <li className='flex flex-col items-center gap-2 py-8 text-gray-400'>
                        <ICONS.finances size={36} />
                        <span className='text-sm'>Nenhuma parcela pendente</span>
                    </li>
                ) : pendingInstallments.map(({ purchase, installmentNumber, installmentAmount, dueDate }) => {
                    const payee = payees.list.find(p => p.id === purchase.payeeId);
                    return (
                        <li key={`${purchase.id}-${installmentNumber}`}>
                            <div className='relative group'>
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-gray-500/5 to-gray-600/5 rounded-xl
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                `} />
                                <div className={`
                                    relative overflow-hidden rounded-xl px-4 py-2 backdrop-blur-lg
                                    bg-white/10 border border-white/20 shadow-xs transition-all duration-300
                                    hover:border-white/30
                                `}>
                                    <div className='flex justify-between items-start gap-4 text-[16px]'>
                                        <div className='flex-1 flex items-center gap-2'>
                                            <h3
                                                className='cursor-pointer hover:underline'
                                                onClick={() => openEdit(purchase)}
                                            >
                                                {purchase.title}
                                            </h3>
                                            <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
                                                {installmentNumber}/{purchase.installmentTotal}
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <button
                                                onClick={() => handlePay(purchase, installmentNumber, installmentAmount)}
                                                className='p-1 rounded hover:bg-white/10 transition-colors'
                                                title='Marcar como pago'
                                            >
                                                <ICONS.check />
                                            </button>
                                            <span className='text-[tomato]'>
                                                {MonetaryService.floatToBr(installmentAmount)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='flex items-center justify-between gap-2 text-sm text-gray-500'>
                                        <span>
                                            {dueDate
                                                ? `Vence ${DateService.dateToBrDate(dueDate)}`
                                                : 'Sem vencimento'
                                            }
                                        </span>
                                        {payee && (
                                            <div className='flex items-center gap-0.5'>
                                                <span>{payee.name}</span>
                                                <ICONS.local />
                                            </div>
                                        )}
                                    </div>
                                    <div className='absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full filter blur-xl -mr-10 -mt-10' />
                                </div>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <InstallmentPurchaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                record={modalRecord}
                setRecord={setModalRecord}
                refresh={installmentPurchasesRefresh}
                payees={payees}
                categories={categories}
                tags={tags}
                creditCards={creditCards}
                user={user}
                paidCount={modalRecord.id ? getPaidCount(modalRecord.id) : 0}
            />
        </>
    );
}
