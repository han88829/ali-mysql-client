import { Response, WhereObject } from "../interface";

export interface IDeleteWhere {
  where(
    field: object | string,
    value?: any,
    operator?: string,
    ignore?: string,
    join?: string
  ): End;
}
interface End extends IDeleteWhere {
  execute(): Promise<Response>;
  toSql(): string;
}
type INoodDelete = IDeleteWhere & End;
class DeleteBuilder implements INoodDelete {
  provider: any;
  data: any;
  constructor(provider: any, table: string) {
    this.provider = provider;
    this.data = {
      table,
      where: [],
    };
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

  execute(): Promise<Response> {
    return this.provider
      .parseDelete(this.data)
      .execute()
      .then((r: Array<Response>) => r[0]);
  }

  toSql(): string {
    return this.provider.parseDelete(this.data).format();
  }
}
export default DeleteBuilder;
