export class BaseModel {

    constructor(data = {}) {
        Object.assign(this, data);
    }

    static fields = {};

    toDatabase() {
        const db = {};
        const fields = this.constructor.fields;
        for(const key in fields) {
            const dbKey = fields[key];
            const value = this[key];
            if(value !== undefined) {
                db[dbKey] = value;
            }
        }
        return db;
    }

    static fromDatabase(data) {
        if(!data) return null;
        const mapped = {};
        const fields = this.fields;
        for(const key in fields) {
            const dbKey = fields[key];
            mapped[key] = data[dbKey];
        }
        return new this(mapped);
    }

    static fromDatabaseList(list = []) {
        return list.map(item => this.fromDatabase(item));
    }

    update(data = {}) {
        Object.assign(this, data);
        return this;
    }

    clone() {
        return new this.constructor({ ...this });
    }

    toJSON() {
        return { ...this };
    }
}