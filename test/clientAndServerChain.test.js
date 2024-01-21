import { QwQSocketServer } from "../src/server/QwQSocketServer.js";
import { QwQSocketClient } from "../src/client/QwQSocketClient.js";
import { EventRule } from "../src/rule/EventRule.js";
import { RuleType } from "../src/rule/RuleType.js";

test("client and server complete chain", async () =>
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

    /**
     * @type {Array<{ receiver: "client" | "server", metaObj: Object }>}
     */
    let testArray = [];

    { // 创建测试事件监听器
        server.serverMappingRules.serverAddEventRule("serverTestEvent", EventRule.create([
            {
                key: "timeSequence",
                rule: RuleType.number()
            }
        ]));
        serverClient.eventListener.serverTestEvent = (e) =>
        {
            // console.log("on serverTestEvent", e.timeSequence);
            testArray.push({
                receiver: "server",
                metaObj: e
            });
        };

        server.clientMappingRules.serverAddEventRule("clientTestEvent", EventRule.createWithoutType([
            {
                key: "timeSequence",
            }
        ]));

        client.addEventRule("clientTestEvent", EventRule.create([
            {
                key: "timeSequence",
                rule: RuleType.number()
            }
        ]));
        client.eventListener.clientTestEvent = (e) =>
        {
            // console.log("on clientTestEvent", e.timeSequence);
            testArray.push({
                receiver: "client",
                metaObj: e
            });
        };
    }

    { // 调用测试事件监听器
        client.sendTrigger("serverTestEvent", { timeSequence: 0 });
        serverClient.sendTrigger("clientTestEvent", { timeSequence: 1 });
        client.sendTrigger("serverTestEvent", { timeSequence: 2 });
        serverClient.sendTrigger("clientTestEvent", { timeSequence: 3 });
        client.sendTrigger("serverTestEvent", { timeSequence: 4 });
        serverClient.sendTrigger("clientTestEvent", { timeSequence: 5 });
    }

    /**
     * @type {(x: any) => void}
     */
    let done = null;

    { // 进行测试
        setTimeout(() =>
        {

            expect(testArray).toStrictEqual([
                {
                    receiver: "server",
                    metaObj: { timeSequence: 0 }
                },
                {
                    receiver: "client",
                    metaObj: { timeSequence: 1 }
                },
                {
                    receiver: "server",
                    metaObj: { timeSequence: 2 }
                },
                {
                    receiver: "client",
                    metaObj: { timeSequence: 3 }
                },
                {
                    receiver: "server",
                    metaObj: { timeSequence: 4 }
                },
                {
                    receiver: "client",
                    metaObj: { timeSequence: 5 }
                }
            ]);

            done();

        }, 1000);
    }

    return new Promise(resolve => { done = resolve; });
});