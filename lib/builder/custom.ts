class CustomSqlBuilder {
  provider: any;
  data: any;
  constructor(provider: any, sql: string, arg: Array<string | number | any>) {
    this.provider = provider;
    this.data = {
      sql,
      arg: Array.isArray(arg) ? arg : [],
    };
  }

  params(arg: any) {
    if (Array.isArray(arg)) {
      this.data.arg = arg;
    }
    return this;
  }

  execute() {
    return this.provider
      .parseCustomSql(this.data)
      .execute();
  }

  toSql() {
    return this.provider
      .parseCustomSql(this.data)
      .format();
  }
}

module.exports = CustomSqlBuilder;
