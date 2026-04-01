import { useState, useMemo } from 'react';
import { expenseRepository } from '@/repositories/ExpenseRepository';
import { ExpenseModel } from '@/models/ExpenseModel';
import { CreditCardService } from '@/services/CreditCardService';
import { DateService } from '@/services/DateService';
import { AlertService } from '@/services/alertService';
import { PAYMENT_TYPES } from '@/enums/PaymentTypes';
import { ICONS } from '@/assets/icons';
import { DefaultBtn } from '@/components/buttons/DefaultBtn';
import { InstallmentPurchaseModal } from '@/screens/financial/InstallmentPurchaseModal';
import { PendingInstallmentCard } from '@/screens/financial/PendingInstallmentCard';
import { SpinLoader } from '@/components/elements/SpinLoader';

const emptyPurchase = {
    title: '',
    description: '',
    totalAmount: 0,
    installmentTotal: 1,
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

    const now = new Date();

    const installmentsByMonth = useMemo(() => {
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
        result.sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return a.dueDate - b.dueDate;
        });

        const sections = [];
        for (const item of result) {
            const rawLabel = item.dueDate
                ? item.dueDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
                : 'sem vencimento';
            const label = rawLabel.charAt(0).toUpperCase() + rawLabel.slice(1);
            const key = item.dueDate
                ? `${item.dueDate.getFullYear()}-${item.dueDate.getMonth()}`
                : 'none';
            let section = sections.find(s => s.key === key);
            if (!section) {
                section = { key, label, items: [] };
                sections.push(section);
            }
            section.items.push(item);
        }
        return sections;
    }, [installmentPurchases.list, expenses, creditCards.list]);

    const firstFutureKey = installmentsByMonth.find(({ key }) => {
        if (key === 'none') return false;
        const [year, month] = key.split('-').map(Number);
        return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());
    })?.key ?? null;

    function isBlocked(key) {
        if (key === 'none' || key === firstFutureKey) return false;
        const [year, month] = key.split('-').map(Number);
        return year > now.getFullYear() || (year === now.getFullYear() && month > now.getMonth());
    }

    async function handlePayAll(key, items) {
        setPayingAllKey(key);
        try {
            await Promise.all(items.map(({ purchase, installmentNumber, installmentAmount }) =>
                expenseRepository.insert(new ExpenseModel({
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
                }))
            ));
            expensesRefresh?.();
            AlertService.fastSuccess();
        } catch (e) {
            AlertService.error(e.message);
        } finally {
            setPayingAllKey(null);
        }
    }

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

    const [payingAllKey, setPayingAllKey] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalRecord, setModalRecord] = useState(emptyPurchase);

    function openNew() {
        setModalRecord({
            ...emptyPurchase,
            startDate: DateService.dateToSqlDate(new Date()),
            creditCardId: creditCards.list[0]?.id ?? null
        });
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
                {installmentsByMonth.length === 0 ? (
                    <li className='flex flex-col items-center gap-2 py-8 text-gray-400'>
                        <ICONS.finances size={36} />
                        <span className='text-sm'>Nenhuma parcela pendente</span>
                    </li>
                ) : installmentsByMonth.map(({ key, label, items }) => (
                    <li key={key} className='flex flex-col gap-2'>
                        <div className='flex items-center justify-between px-1'>
                            <h4 className='text-xs font-semibold tracking-widest text-gray-400'>
                                {label}
                            </h4>
                            <button
                                onClick={() => handlePayAll(key, items)}
                                disabled={payingAllKey === key || isBlocked(key)}
                                title='Pagar todas as parcelas do mês'
                                className={`
                                    text-xs flex items-center gap-1 px-2 py-0.5 rounded
                                    bg-blue-500/10 hover:bg-blue-500/25
                                    border border-blue-500/20 hover:border-blue-500/40
                                    text-blue-400 hover:text-blue-300
                                    transition-all duration-200 cursor-pointer
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                `}
                            >
                                {payingAllKey === key
                                    ? <SpinLoader color='text-blue-400' width='0.75rem' />
                                    : <><ICONS.check size={12} /> Pagar todos</>
                                }
                            </button>
                        </div>
                        <ul className='flex flex-col gap-2'>
                            {items.map(({ purchase, installmentNumber, installmentAmount, dueDate }) => (
                                <li key={`${purchase.id}-${installmentNumber}`}>
                                    <PendingInstallmentCard
                                        purchase={purchase}
                                        installmentNumber={installmentNumber}
                                        installmentAmount={installmentAmount}
                                        dueDate={dueDate}
                                        payees={payees}
                                        categories={categories}
                                        tags={tags}
                                        onPay={handlePay}
                                        onEdit={openEdit}
                                        disabled={isBlocked(key)}
                                    />
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
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
