import { QwQSocketServerClient } from "./QwQSocketServerClient";

/**
 * qwq-socket 服务器
 * 表示一个可接受客户端连接的服务器上下文
 */
export class QwQSocketServer
{


    createClient()
    {
        let ret = new QwQSocketServerClient();
        ret.server = this;
        return ret;
    }
}