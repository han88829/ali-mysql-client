const DbProvider = require('./provider');
const SelectBuilder = require('./builder/select');
const InsertBuilder = require('./builder/insert');
const SaveBuilder = require('./builder/save');
const UpdateBuilder = require('./builder/update');
import DeleteBuilder from './builder/delete';
const CustomBuilder = require('./builder/custom');
import { Options } from './interface';

class DbClient {
    provider: any;
    literals: any;
    constructor(options: Options) {
        this.provider = new DbProvider(options);
        this.literals = this.provider.command.literals;
    }

    select(sql: string) {
        return new SelectBuilder(this.provider, sql);
    }

    insert(table: string, data: Object | Array<Object>) {
        return new InsertBuilder(this.provider, table, data);
    }

    save(table: string, data: Object | Array<Object>) {
        return new SaveBuilder(this.provider, table, data);
    }

    update(table: string, data: Object | Array<Object>) {
        return new UpdateBuilder(this.provider, table, data);
    }

    delete(table: string) {
        return new DeleteBuilder(this.provider, table);
    }

    sql(sql: string, arg: Array<string | number | any>) {
        return new CustomBuilder(this.provider, sql, arg);
    }

    useTransaction() {
        const trans = new DbClient(this.provider.command.mysql);
        trans.provider.config.setConfig(this.provider.config);
        return trans.provider.command.useTransaction().then(() => trans);
    }

    commit() {
        return this.provider.command.commit().then(() => this);
    }

    rollback() {
        return this.provider.command.rollback().then(() => this);
    }

    config(config: Options) {
        return this.provider.config.setConfig(config);
    }

    literal(value: any) {
        return new this.literals.Literal(value);
    }
}

module.exports = DbClient;
