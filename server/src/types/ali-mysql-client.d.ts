

declare module 'ali-mysql-client' {
    export interface DbConfig {
        host: string,
        user: string,
        password: string,
        database: string
    }

    type sql = string;
    type literals = object;

    type TableName = string;
    // 表名

    type QueryField = string;
    // 查询字段

    type QueryValue = string | number;
    // 查询值

    enum QueryOperator {
        eq = "eq",
        lt = "lt",
        like = "like",
        keywords = "keywords",
        setinset = "setinset",
        insetfind = "insetfind",
    }
    // 操作符

    type QueryIgnore = string;
    // 是否加条件

    enum QueryJoin {
        and = "and",
        or = "or"
    }
    // 连接符号

    interface QueryObject {
        field: QueryField,
        value: QueryValue,
        operator: QueryOperator,
        ignore: QueryIgnore,
        join: QueryJoin
    }
    // 查询对象


    type WhereFirstArg = QueryField | QueryObject;
    // Where查询参数

    type OrderBy = string;
    // 排序方式

    type GroupBy = string;
    // 分组方式

    interface ResultPaging {
        total: number,
        rows: object[],
        pageIndex: number,
        pageSize: number,
        pageCount: number
    }
    // 分页查询结果

    interface SelectBuilderData {
        select: sql;
        from: TableName;
        where: [];
        orderby: OrderBy;
        groupby: GroupBy;
        having: string;
        rows: number;
        page: number;
        fromArg: [];
    }

    type CommandFormat = Function;

    interface CommandExecuteArg {
        sql: sql,
        arg: string
    }

    class DbCommand {
        literals: literals;
        format: CommandFormat;
        execute(arg: CommandExecuteArg): Function;
    }

    class Execution {
        constructor(command: DbCommand, sql: sql, arg: string);

        format(): sql;
        execute(): Function;
    }

    class DbProvider {
        command: DbCommand;

        parseSelect(data: object): Execution;
    }

    class SelectBuilder {
        provider: DbProvider;
        data: SelectBuilderData;
        constructor(provider: DbProvider, select: sql);

        from(from: TableName, arg?: string[]): SelectBuilder;

        where(
            field: WhereFirstArg,
            value?: QueryValue,
            operator?: QueryOperator,
            ignore?: QueryIgnore,
            join?: QueryJoin
        ): SelectBuilder;

        orderby(orderby: OrderBy): SelectBuilder;
        groupby(groupby: GroupBy): SelectBuilder;
        queryValue(): Promise<string | number>;
        queryRow(): Promise<object>;
        queryList(): Promise<object[]>;
        queryListWithPaging(page?: number, rows?: number): Promise<ResultPaging>;
    }

    class DbClient {
        provider: DbProvider;
        literals: literals;

        constructor(options: DbConfig);
        select(sql: sql): SelectBuilder;
    }


    export default DbClient;
}