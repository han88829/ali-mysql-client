import {} from "knex/types/";
export interface Response {
  fieldCount: number;
  affectedRows: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

export interface InsertResponse {
  fieldCount: number;
  affectedRows: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
  insertId: number;
}

export interface Options {
  mysql: Object;
  config?: any;
}

export interface WhereObject {
  [key: string]: any;
}
