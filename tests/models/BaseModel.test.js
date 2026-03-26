import { BaseModel } from '@/models/BaseModel';

class SampleModel extends BaseModel {
    static fields = {
        id: 'id',
        userName: 'user_name',
        totalAmount: 'total_amount',
    };
}

describe('BaseModel', () => {

    describe('constructor', () => {
        it('atribui as propriedades passadas', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice', totalAmount: 50 });
            expect(m.id).toBe(1);
            expect(m.userName).toBe('Alice');
            expect(m.totalAmount).toBe(50);
        });

        it('instancia sem argumentos sem erros', () => {
            expect(() => new SampleModel()).not.toThrow();
        });
    });

    describe('toDatabase', () => {
        it('mapeia chaves JS para colunas do banco', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice', totalAmount: 99 });
            expect(m.toDatabase()).toEqual({
                id: 1,
                user_name: 'Alice',
                total_amount: 99,
            });
        });

        it('omite campos com valor undefined', () => {
            const m = new SampleModel({ id: 2 });
            const db = m.toDatabase();
            expect(db).toEqual({ id: 2 });
            expect(db).not.toHaveProperty('user_name');
            expect(db).not.toHaveProperty('total_amount');
        });

        it('inclui campos com valor null ou zero', () => {
            const m = new SampleModel({ id: 3, userName: null, totalAmount: 0 });
            const db = m.toDatabase();
            expect(db.user_name).toBeNull();
            expect(db.total_amount).toBe(0);
        });
    });

    describe('fromDatabase', () => {
        it('mapeia colunas do banco para chaves JS', () => {
            const row = { id: 10, user_name: 'Bob', total_amount: 200 };
            const m = SampleModel.fromDatabase(row);
            expect(m).toBeInstanceOf(SampleModel);
            expect(m.id).toBe(10);
            expect(m.userName).toBe('Bob');
            expect(m.totalAmount).toBe(200);
        });

        it('retorna null para entrada null', () => {
            expect(SampleModel.fromDatabase(null)).toBeNull();
        });

        it('define campo como undefined quando coluna não existe na linha', () => {
            const m = SampleModel.fromDatabase({ id: 5 });
            expect(m.userName).toBeUndefined();
        });
    });

    describe('fromDatabaseList', () => {
        it('mapeia uma lista de linhas para instâncias do model', () => {
            const rows = [
                { id: 1, user_name: 'A', total_amount: 10 },
                { id: 2, user_name: 'B', total_amount: 20 },
            ];
            const list = SampleModel.fromDatabaseList(rows);
            expect(list).toHaveLength(2);
            expect(list[0]).toBeInstanceOf(SampleModel);
            expect(list[1].userName).toBe('B');
        });

        it('retorna array vazio para lista vazia', () => {
            expect(SampleModel.fromDatabaseList([])).toEqual([]);
        });

        it('usa array vazio como padrão', () => {
            expect(SampleModel.fromDatabaseList()).toEqual([]);
        });
    });

    describe('update', () => {
        it('atualiza propriedades e retorna a própria instância', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice' });
            const result = m.update({ userName: 'Bob', totalAmount: 42 });
            expect(m.userName).toBe('Bob');
            expect(m.totalAmount).toBe(42);
            expect(result).toBe(m);
        });
    });

    describe('clone', () => {
        it('retorna nova instância do mesmo tipo com os mesmos dados', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice', totalAmount: 5 });
            const cloned = m.clone();
            expect(cloned).toBeInstanceOf(SampleModel);
            expect(cloned).not.toBe(m);
            expect(cloned.id).toBe(1);
            expect(cloned.userName).toBe('Alice');
        });

        it('clone é independente do original', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice' });
            const cloned = m.clone();
            cloned.userName = 'Bob';
            expect(m.userName).toBe('Alice');
        });
    });

    describe('toJSON', () => {
        it('retorna objeto plano com os dados da instância', () => {
            const m = new SampleModel({ id: 1, userName: 'Alice', totalAmount: 10 });
            const json = m.toJSON();
            expect(json).toEqual({ id: 1, userName: 'Alice', totalAmount: 10 });
            expect(Object.getPrototypeOf(json)).toBe(Object.prototype);
        });
    });

});
