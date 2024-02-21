import { QueryError } from "./QueryError.js";

/**
 * 查询超时错误
 * 当发起查询超时时抛出
 */
export class QueryTimeoutError extends QueryError
{
    constructor()
    {
        super("Timeout");
    }

    toString()
    {
        return `QueryError: Timeout`;
    }
}