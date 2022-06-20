class Execution {
  command: any;
  sql: string;
  arg: Array<string | number | any>;
  constructor(command: any, sql: string, arg: Array<string | number | any>) {
    this.command = command;
    this.sql = sql;
    this.arg = arg;
  }

  format() {
    const { sql, arg } = this;
    return this.command.format(sql, arg);
  }

  execute() {
    const { sql, arg } = this;
    return this.command.execute({ sql, arg });
  }
}

module.exports = Execution;
