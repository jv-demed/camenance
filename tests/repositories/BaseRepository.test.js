import { BaseRepository } from '@/repositories/BaseRepository';

jest.mock('@/supabase/crud', () => ({
    Crud: {
        insert: jest.fn(),
        findById: jest.fn(),
        findAll: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

import { Crud } from '@/supabase/crud';

class MockModel {
    static fields = { name: 'nm_name', value: 'vl_value' };

    constructor(data) {
        Object.assign(this, data);
    }

    toDatabase() {
        return { nm_name: this.name, vl_value: this.value };
    }

    static fromDatabase(row) {
        return new MockModel({ name: row.nm_name, value: row.vl_value, id: row.id });
    }

    static fromDatabaseList(rows) {
        return rows.map(MockModel.fromDatabase);
    }
}

describe('BaseRepository', () => {
    let repo;

    beforeEach(() => {
        repo = new BaseRepository('mock_table', MockModel);
        jest.clearAllMocks();
    });

    describe('insert', () => {
        it('insere e retorna modelo mapeado', async () => {
            Crud.insert.mockResolvedValue({ id: 1, nm_name: 'Teste', vl_value: 100 });

            const result = await repo.insert({ name: 'Teste', value: 100 });

            expect(Crud.insert).toHaveBeenCalledWith('mock_table', { nm_name: 'Teste', vl_value: 100 });
            expect(result).toBeInstanceOf(MockModel);
            expect(result.name).toBe('Teste');
        });

        it('retorna null quando Crud.insert retorna falsy', async () => {
            Crud.insert.mockResolvedValue(null);
            const result = await repo.insert({ name: 'Teste' });
            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('busca e retorna modelo pelo id', async () => {
            Crud.findById.mockResolvedValue({ id: 42, nm_name: 'Foo', vl_value: 50 });

            const result = await repo.findById(42);

            expect(Crud.findById).toHaveBeenCalledWith('mock_table', 42);
            expect(result.name).toBe('Foo');
            expect(result.id).toBe(42);
        });

        it('retorna null quando não encontrado', async () => {
            Crud.findById.mockResolvedValue(null);
            const result = await repo.findById(999);
            expect(result).toBeNull();
        });
    });

    describe('findAll', () => {
        it('retorna lista de modelos mapeados', async () => {
            Crud.findAll.mockResolvedValue([
                { id: 1, nm_name: 'A', vl_value: 10 },
                { id: 2, nm_name: 'B', vl_value: 20 },
            ]);

            const result = await repo.findAll({ name: 'A' });

            expect(Crud.findAll).toHaveBeenCalledWith('mock_table', { nm_name: 'A' }, null);
            expect(result).toHaveLength(2);
            expect(result[0]).toBeInstanceOf(MockModel);
        });

        it('mapeia o campo de ordenação corretamente', async () => {
            Crud.findAll.mockResolvedValue([]);
            await repo.findAll({}, { column: 'name', ascending: true });
            expect(Crud.findAll).toHaveBeenCalledWith('mock_table', {}, { column: 'nm_name', ascending: true });
        });
    });

    describe('update', () => {
        it('atualiza e retorna modelo atualizado', async () => {
            Crud.update.mockResolvedValue({ id: 1, nm_name: 'Novo', vl_value: 200 });

            const result = await repo.update(1, { name: 'Novo', value: 200 });

            expect(Crud.update).toHaveBeenCalledWith('mock_table', 1, { nm_name: 'Novo', vl_value: 200 });
            expect(result.name).toBe('Novo');
        });
    });

    describe('delete', () => {
        it('chama Crud.delete com tabela e id corretos', async () => {
            Crud.delete.mockResolvedValue(true);

            const result = await repo.delete(5);

            expect(Crud.delete).toHaveBeenCalledWith('mock_table', 5);
            expect(result).toBe(true);
        });
    });
});
