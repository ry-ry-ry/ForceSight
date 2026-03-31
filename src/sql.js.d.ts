declare module 'sql.js' {
    interface SqlJsStatic {
        Database: new (data?: ArrayLike<number>) => Database;
    }

    interface Database {
        run(sql: string, params?: any[]): void;
        exec(sql: string): QueryExecResult[];
        prepare(sql: string): Statement;
        export(): Uint8Array;
        close(): void;
    }

    interface Statement {
        bind(params?: any[]): boolean;
        step(): boolean;
        get(): any[];
        getColumnNames(): string[];
        free(): void;
    }

    interface QueryExecResult {
        columns: string[];
        values: any[][];
    }

    interface SqlJsConfig {
        locateFile?: (filename: string) => string;
    }

    export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
}
