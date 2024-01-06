import { MappingRules } from "../data/MappingRules.js";
import { QwQSocketServerClient } from "./QwQSocketServerClient.js";

/**
 * qwq-socket 服务器
 * 表示一个可接受客户端连接的服务器上下文
 */
export class QwQSocketServer
{
    /**
     * 服务器的映射规则
     * 表示服务端触发的事件相关规则
     * @type {MappingRules}
     */
    serverMappingRules = new MappingRules();
    /**
     * 客户端的映射规则
     * 表示客户端触发的事件相关规则
     * @type {MappingRules}
     */
    clientMappingRules = new MappingRules();

    /**
     * 创建连接到此服务端的客户端
     * @returns {QwQSocketServerClient}
     */
    createClient()
    {
        let ret = QwQSocketServerClient.create(this);
        return ret;
    }
}