export interface Response {
    fieldCount: number;
    affectedRows: number;
    serverStatus: number;
    warningCount: number;
    message: string;
    protocol41: boolean;
    changedRows: number;
}
export interface Options {
    mysql: {
        host: string;
        user: string;
        password: string;
        database: string;
        charset?: string;
        timezone?: string;
    };
    config: any;
}
