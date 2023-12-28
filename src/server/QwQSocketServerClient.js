import { EventHandler } from "../util/EventHandler.js";

/**
 * 连接到 qwq-socket 服务器的客户端实例
 * 绑定到一个服务器上下文
 */
export class QwQSocketServerClient
{
    /**
     * @type {import("./QwQSocketServer").QwQSocketServer}
     */
    server = null;

    sendData = new EventHandler();


    /**
     * 收到客户端的数据
     * @param {Object} data 
     */
    receiveData(data)
    {}
}