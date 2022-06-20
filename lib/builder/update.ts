import { Response } from '../interface';
class UpdateBuilder {
  provider: any;
  data: any;
  constructor(provider: any, table: string, data: any) {
    this.provider = provider;
    this.data = {
      table,
      data: data || {},
      where: [],
    };
  }

  column(name: string, value: any) {
    this.data.data[name] = value;

    return this;
  }

  where(field: object | string, value: string | number, operator: string, ignore: string, join: string) {
    this.data.where.push(
      typeof field === 'object'
        ? field
        : { field, value, operator, ignore, join }
    );

    return this;
  }
  inc(name: string, value: number) {
    this.data.data[name] = this.provider.command.literals.Literal(`${name}+${value}`);
    return this;
  }
  dec(name: string, value: number) {
    this.data.data[name] = this.provider.command.literals.Literal(`${name}-${value}`);
    return this;
  }
  execute(): Promise<Response> {
    return this.provider
      .parseUpdate(this.data)
      .execute();
  }

  toSql(): string {
    return this.provider
      .parseUpdate(this.data)
      .format();
  }
}

export default UpdateBuilder;
