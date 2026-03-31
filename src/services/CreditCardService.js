export class CreditCardService {

    /**
     * Calcula a data de vencimento de uma parcela de crédito
     * @param {CreditCardModel} card - Objeto do cartão de crédito
     * @param {Date|string} purchaseDate - Data da compra
     * @param {number} installmentIndex - Número da parcela (1, 2, 3...)
     * @returns {Date} Data de vencimento da parcela
     */
    static calculateDueDate(card, purchaseDate, installmentIndex = 1) {
        // Converter string para Date se necessário
        const date = typeof purchaseDate === 'string'
            ? new Date(purchaseDate)
            : new Date(purchaseDate);

        const day = date.getDate();

        // Se compra foi feita após o dia de fechamento,
        // a fatura vai para o mês seguinte
        let monthOffset = day > card.closingDay ? 1 : 0;

        // Adicionar offset das parcelas (parcela 1 = mesmo mês/próximo, parcela 2 = 1 mês depois, etc)
        monthOffset += (installmentIndex - 1);

        let month = date.getMonth() + monthOffset;
        let year = date.getFullYear();

        // Ajustar ano e mês se ultrapassar 12 meses
        year += Math.floor(month / 12);
        month = month % 12;

        return new Date(year, month, card.dueDay);
    }

    /**
     * Formata uma data para string no padrão DD/MM/YYYY
     * @param {Date} date
     * @returns {string}
     */
    static formatDate(date) {
        const d = new Date(date);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    }

}
