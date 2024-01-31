import { QwQSocketClient } from "../client/QwQSocketClient.js";
import { QwQSocketServerClient } from "../server/QwQSocketServerClient.js";

/**
 * 绑定器操作器
 * 用于操作socket发送事件或查询
 * @template {QwQSocketClient | QwQSocketServerClient} T
 */
export class BinderOperator
{
    /**
     * @type {T}
     */
    target = null;

    /**
     * 触发事件映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object) => void>}
     */
    trigger = {};

    /**
     * 查询映射对象
     * 调用函数触发对端事件
     * @type {Object<string, (metaObj: Object) => Promise<Object>>}
     */
    query = {};

    /**
     * @param {T} target
     */
    constructor(target)
    {
        this.target = target;
    }

    /**
     * @param {string} eventName
     */
    addTrigger(eventName)
    {
        this.trigger[eventName] = (metaObj) => {
            this.target.sendTrigger(eventName, metaObj);
        };
    }
}