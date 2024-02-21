import { QwQSocketClient } from "../client/QwQSocketClient.js";
import { QwQSocketServerClient } from "../server/QwQSocketServerClient.js";
import { uniqueIdentifierString } from "../util/uniqueIdentifier.js";
import { QueryError } from "./QueryError.js";
import { QueryTimeoutError } from "./QueryTimeoutError.js";

const metaObjQueryIdKey = "-query-id";
const metaObjCauseKey = "-cause";

/**
 * 绑定器操作器
 * 用于操作socket发送事件或查询
 * @template {QwQSocketClient | QwQSocketServerClient} T
 */
export class BinderOperator
{
    /**
     * 操作器的操作目标
     * @type {T}
     */
    #target = null;

    /**
     * 触发事件映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object) => void>}
     */
    trigger = {};

    /**
     * 查询映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object, timeout?: number, timeoutBehavior?: "reject" | "resolve" | "discard") => Promise<Object>>}
     */
    query = {};

    /**
     * @param {T} target
     */
    constructor(target)
    {
        this.#target = target;
    }

    /**
     * 添加触发器
     * @param {string} eventName
     */
    addTrigger(eventName)
    {
        if (this.trigger[eventName])
            throw `Trigger "${eventName}" already exists`;
        this.trigger[eventName] = (metaObj) =>
        {
            this.#target.sendTrigger(eventName, metaObj);
        };
    }

    /**
     * 添加查询
     * @param {string} queryName
     */
    addQuery(queryName)
    {
        if (this.query[queryName])
            throw `Query "${queryName}" already exists`;

        let requestEventName = queryName + "-req";
        let respondEventName = queryName + "-rsp";
        let errorRespondEventName = queryName + "-ersp";

        if (this.#target.eventListener[respondEventName])
            throw `Unable to bind query "${queryName}" because response event listener is occupied`;
        if (this.#target.eventListener[errorRespondEventName])
            throw `Unable to bind query "${queryName}" because error response event listener is occupied`;

        /**
         * 查询中的映射
         * 查询id 到 查询响应操作对象 映射
         * @type {Map<string, {
         *  resolve: (value: any) => void,
         *  reject: (err: any) => void,
         *  startTime: number,
         *  timeoutId?: number | NodeJS.Timeout
         * }>}
         */
        let inQueryMap = new Map();

        this.#target.eventListener[respondEventName] = (/** @type {any} */ metaObj) =>
        {
            let queryId = metaObj[metaObjQueryIdKey];
            let inQueryObj = inQueryMap.get(queryId);
            if (inQueryObj)
            {
                inQueryMap.delete(queryId);
                delete metaObj[metaObjQueryIdKey];

                inQueryObj.resolve(metaObj);
            }
        };
        this.#target.eventListener[errorRespondEventName] = (/** @type {any} */ metaObj) =>
        {
            let queryId = metaObj[metaObjQueryIdKey];
            let inQueryObj = inQueryMap.get(queryId);
            if (inQueryObj)
            {
                inQueryMap.delete(queryId);

                inQueryObj.reject(new QueryError(metaObj[metaObjCauseKey]));
            }
        };

        this.query[queryName] = (queryMetaObj, timeout, timeoutBehavior) =>
        {
            if (queryMetaObj[metaObjQueryIdKey] != undefined)
                throw `Cannot use internally occupied name "${metaObjQueryIdKey}"`;

            return new Promise((resolve, reject) =>
            {
                let queryId = uniqueIdentifierString();
                let metaObj = Object.assign({}, queryMetaObj);
                metaObj[metaObjQueryIdKey] = queryId;

                inQueryMap.set(queryId, {
                    resolve,
                    reject,
                    startTime: Date.now(),
                    timeoutId: (
                        timeout != undefined ?
                            setTimeout(() =>
                            {
                                let inQueryObj = inQueryMap.get(queryId);
                                inQueryMap.delete(queryId);

                                if (timeoutBehavior == "resolve")
                                    inQueryObj.resolve(null);
                                else if (timeoutBehavior != "discard")
                                    inQueryObj.reject(new QueryTimeoutError());
                            }, timeout) :
                            undefined
                    )
                });

                this.#target.sendTrigger(requestEventName, metaObj);
            });
        };
    }
}