import { QwQSocketServer } from "../src/server/QwQSocketServer.js";
import { QwQSocketClient } from "../src/client/QwQSocketClient.js";
import { EventRule } from "../src/rule/EventRule.js";
import { RuleType } from "../src/rule/RuleType.js";

test("chain with EventRuleBinder", async () =>
{
    let server = new QwQSocketServer();

    let serverClient = server.createClient();

    let client = new QwQSocketClient();

    { // 创建客户端和服务器的连接
        serverClient.sendData.add(e =>
        {
            client.receiveData(e.prefix, structuredClone(e.body));
        });
        client.sendData.add(e =>
        {
            serverClient.receiveData(e.prefix, structuredClone(e.body));
        });
    }

    { // 创建测试事件监听器
    }

    { // 调用测试事件监听器
    }
});