
export interface Response {
  fieldCount: number,
  affectedRows: number,
  serverStatus: number,
  warningCount: number,
  message: string,
  protocol41: boolean,
  changedRows: number,
}


export interface Options {
  host: string,
  user: string,
  password: string,
  database: string,
  charset: string,//制定字符集用于保存emoji
  timezone: string
}