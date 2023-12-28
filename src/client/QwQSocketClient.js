import { EventHandler } from "../util/EventHandler.js";

/**
 * qwq-socket 客户端
 * 表示 服务器侧 或 用户侧 的客户端实例
 */
export class QwQSocketClient
{
    sendData = new EventHandler();


    /**
     * 收到客户端的数据
     * @param {Object} data 
     */
    receiveData(data)
    { }
}