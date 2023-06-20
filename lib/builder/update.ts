import { Response, WhereObject } from "../interface";
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

  /**
   * @description: 单独修改某一列
   * @param {string} name 字段名
   * @param {any} value 数据值
   * @return {*}
   */
  column(name: string, value: any) {
    this.data.data[name] = value;

    return this;
  }
  /**
   * @description: 查询条件
   * @param {object} field 字段名
   * @param {string} value 字段值
   * @param {string} operator 符号 <>=等 默认=
   * @param {string} ignore 忽视条件
   * @param {string} join or或and 默认and
   * @return {*}
   */
  where(
    field: WhereObject | string | Array<any>,
    value?: any,
    operator?: string,
    ignore?: string,
    join?: string
  ) {
    if (Array.isArray(field)) {
      // where = [[key, value, operator, ignore, join]];
      this.data.where.push(
        ...field.map((item) => {
          return {
            field: item[0],
            value: item[1],
            operator: item[2],
            ignore: item[3],
            join: item[4],
          };
        })
      );
    } else if (typeof field === "object") {
      this.data.where.push(
        ...Object.keys(field).map((key: string) => ({
          field: key,
          value: field[key],
          operator,
          ignore,
        }))
      );
    } else {
      this.data.where.push({ field, value, operator, ignore, join });
    }

    return this;
  }
  inc(name: string, value: number) {
    this.data.data[name] = this.provider.command.literals.Literal(
      `${name}+${value}`
    );
    return this;
  }
  dec(name: string, value: number) {
    this.data.data[name] = this.provider.command.literals.Literal(
      `${name}-${value}`
    );
    return this;
  }
  execute(): Promise<Response> {
    return this.provider.parseUpdate(this.data).execute();
  }

  toSql(): string {
    return this.provider.parseUpdate(this.data).format();
  }
}

export default UpdateBuilder;
