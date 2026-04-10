import { Crud } from '@/supabase/crud';

export class BaseRepository {

    constructor(tableName, Model) {
        this.table = tableName;
        this.Model = Model;
    }

    async insert(data) {
        const payload = data instanceof this.Model
            ? data.toDatabase()
            : this.#mapFields(data);
        const result = await Crud.insert(this.table, payload);
        return result ? this.Model.fromDatabase(result) : null;
    }

    async findById(id) {
        const result = await Crud.findById(this.table, id);
        return result ? this.Model.fromDatabase(result) : null;
    }

    async findAll(filters = {}, order = null, dateRange = null) {
        const mappedFilters = this.#mapFields(filters);
        const mappedOrder = order
            ? { ...order, column: this.Model.fields[order.column] ?? order.column }
            : null;
        const results = await Crud.findAll(this.table, mappedFilters, mappedOrder, dateRange);
        return this.Model.fromDatabaseList(results);
    }

    async update(id, data) {
        const payload = data instanceof this.Model
            ? data.toDatabase()
            : this.#mapFields(data);
        const result = await Crud.update(this.table, id, payload);
        return result ? this.Model.fromDatabase(result) : null;
    }

    async delete(id) {
        return Crud.delete(this.table, id);
    }

    #mapFields(data = {}) {
        const mapped = {};
        const fields = this.Model.fields;
        for(const key in data) {
            const dbKey = fields[key] || key;
            mapped[dbKey] = data[key];
        }
        return mapped;
    }

}