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
  mysql: {
    host: string;
    user: string;
    port?: string | number;
    password: string;
    database: string;
    charset?: string;
    timezone?: string;
  };
  config?: any;
}

export interface WhereObject {
  [key: string]: any;
}
