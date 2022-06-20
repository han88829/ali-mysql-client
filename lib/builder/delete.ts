import { Response } from '../interface';
class DeleteBuilder {
  provider: any;
  data: any;
  constructor(provider: any, table: string) {
    this.provider = provider;
    this.data = {
      table,
      where: [],
    };
  }

  where(field: Object | string, value: any, operator: string, ignore: string, join: string) {
    this.data.where.push(
      typeof field === 'object'
        ? field
        : { field, value, operator, ignore, join }
    );

    return this;
  }

  execute(): Promise<Response> {
    return this.provider
      .parseDelete(this.data)
      .execute();
  }

  toSql(): string {
    return this.provider
      .parseDelete(this.data)
      .format();
  }
}

export default DeleteBuilder;