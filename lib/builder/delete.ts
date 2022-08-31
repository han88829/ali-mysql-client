import { Response } from '../interface';

export interface IDeleteWhere {
  where(field: object | string, value: any, operator?: string, ignore?: string, join?: string): End;
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
  where(field: Object | string, value: any, operator?: string, ignore?: string, join?: string) {
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