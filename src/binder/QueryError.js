/**
 * 查询时错误
 */
export class QueryError
{
    /**
     * 错误原因
     * @type {string}
     */
    cause = "";

    /**
     * 请求错误
     * 在请求处理函数中抛出将返回错误
     * @param {string} cause
     */
    constructor(cause)
    {
        this.cause = cause;
    }

    toString()
    {
        return `QueryError: ${this.cause}`;
    }
}