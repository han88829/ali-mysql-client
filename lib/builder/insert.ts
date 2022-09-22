import { InsertResponse } from '../interface';
class InsertBuilder {
  provider: any;
  data: any;
  constructor(provider: any, table: string, data: object | any) {
    this.provider = provider;
    this.data = {
      table,
      data: data || {},
    };
  }

  column(name: string, value: string | number | any) {
    if (Array.isArray(this.data.data)) {
      this.data.data.forEach((item: any) => (item[name] = value));
    } else {
      this.data.data[name] = value;
    }

    return this;
  }

  execute(): Promise<InsertResponse> {
    return this.provider
      .parseInsert(this.data)
      .execute();
  }

  toSql(): string {
    return this.provider
      .parseInsert(this.data)
      .format();
  }
}

export default InsertBuilder;
