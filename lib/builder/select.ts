import { WhereObject } from "../interface";

export interface From {
  from(from: string, arg?: any): Where;
}

interface End {
  value(): Promise<string | number>;
  findOne(): any;
  find(rows?: number): any;
  page(page: number, rows: number): any;
  toSql(): string;
}

interface Where extends End {
  where(
    field: object | string,
    value: any,
    operator?: string,
    ignore?: string,
    join?: string
  ): this;
  join(join: string, arg?: any): this;
  orderby(orderby: string): this;
  groupby(groupby: string): this;
  having(having: string): this;
}

type INoodleRobot = From & End;
class SelectBuilder implements INoodleRobot {
  provider: any;
  data: any;
  constructor(provider: any, select = "*") {
    this.provider = provider;
    this.data = {
      select: select.replace(/\r|\n/g, ""), //去掉回车、换行符，兼容模板字符串
      from: "",
      where: [],
      orderby: "",
      groupby: "",
      having: "",
      rows: 0,
      page: 0,
      fromArg: [],
    };
  }

  /**
   * @description: 数据库表名 必填
   * @param {string} from table name
   * @param {any} arg
   * @return {*}
   */
  from(from: string, arg?: any) {
    if (this.data.form) {
      this.data.form += " " + from;
    } else {
      this.data.from = from;
    }

    if (Array.isArray(arg)) {
      this.data.fromArg.push.apply(this.data.fromArg, arg);
    }

    return this;
  }

  /**
   * @description: join 支持left right等 使用.join('lefy join A a on a.id = b.id')
   * @param {string} join
   * @param {any} arg
   * @return {*}
   */
  join(join: string, arg?: any) {
    this.data.from += " " + join;

    if (Array.isArray(arg)) {
      this.data.fromArg.push.apply(this.data.fromArg, arg);
    }

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
    value: any,
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

  orderby(orderby: string) {
    this.data.orderby += orderby;

    return this;
  }

  groupby(groupby: string) {
    this.data.groupby += groupby;

    return this;
  }

  having(having: string) {
    this.data.having += having;

    return this;
  }

  /**
   * @description: 查询单个值value
   * @return {*}
   */
  value(): Promise<string | number> {
    const data = { ...this.data, page: 1, rows: 1 };
    return this.provider
      .parseSelect(data)
      .execute()
      .then((result: any) => {
        const row = result[0] || {};
        const field = Object.keys(row)[0];
        return row[field];
      });
  }

  /**
   * @description: 查询一行数据
   * @return {*}
   */
  findOne(): Promise<object | null> {
    const data = { ...this.data, page: 1, rows: 1 };
    return this.provider
      .parseSelect(data)
      .execute()
      .then((result: Array<any>) => result[0]);
  }

  /**
   * @description: 查询多行数据
   * @param {*} rows 查询行数，默认为零不限制长度
   * @return {*}
   */
  find(rows: number = 0): Promise<Array<Object>> {
    return this.provider
      .parseSelect({
        ...this.data,
        rows,
        page: rows > 0 ? 1 : 0,
      })
      .execute()
      .then((result: Array<any>) => result);
  }

  /**
   * @description: 分页查询
   * @param {*} page 页码
   * @param {*} rows 每页数量
   * @return {*}
   */
  page(page = 1, rows = 20) {
    const dataForRows = {
      ...this.data,
      rows,
      page,
    };
    const dataForCount = {
      ...this.data,
      rows: 0,
      page: 0,
      orderby: "",
    };

    // 构造数据列表查询
    const queryRows = this.provider.parseSelect(dataForRows);

    // 构造数据总数量查询，如果有groupby时，count + groupby获取的是多条数据，结果不正确必须再包一层
    let queryTotal: any = null;
    if (
      this.data.groupby ||
      this.data.select.toLowerCase().includes("distinct")
    ) {
      queryTotal = this.provider.parseSelect(dataForCount);
      queryTotal.sql = `select count(*) as total from (${queryTotal.sql}) as t`;
    } else {
      dataForCount.select = "count(*) as total";
      queryTotal = this.provider.parseSelect(dataForCount);
    }

    // 返回分页查询结果
    return Promise.all([queryRows.execute(), queryTotal.execute()]).then(
      (values) => ({
        total: values[1][0].total,
        rows: values[0],
        pageIndex: Number(page),
        pageSize: Number(rows),
        pageCount: Math.ceil(values[1][0].total / (rows || 1)),
      })
    );
  }

  toSql() {
    return this.provider.parseSelect(this.data).format();
  }
}
export default SelectBuilder;
