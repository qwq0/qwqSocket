import { QwQSocketServer } from "../src/server/QwQSocketServer.js";
import { QwQSocketClient } from "../src/client/QwQSocketClient.js";
import { EventRule } from "../src/rule/EventRule.js";
import { RuleType } from "../src/rule/RuleType.js";
import { RuleBinder } from "../src/binder/RuleBinder.js";

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

    /**
     * @type {Array<{ receiver: "client" | "server", metaObj: Object }>}
     */
    let testArray = [];

    let serverRuleBinder = RuleBinder.createServerBound();
    let clientRuleBinder = RuleBinder.createClientBound();
    serverRuleBinder.bindOpposite(clientRuleBinder);

    { // 创建测试事件监听器
        serverRuleBinder.addEventRules({
            serverTestEvent: EventRule.create([
                {
                    key: "timeSequence",
                    rule: RuleType.number()
                }
            ])
        });

        serverRuleBinder.setEventListeners({
            serverTestEvent: (e) =>
            {
                // console.log("on serverTestEvent", e.timeSequence);
                testArray.push({
                    receiver: "server",
                    metaObj: e
                });
            }
        });


        clientRuleBinder.addEventRules({
            clientTestEvent: EventRule.create([
                {
                    key: "timeSequence",
                    rule: RuleType.number()
                }
            ])
        });

        clientRuleBinder.setEventListeners({
            clientTestEvent: (e) =>
            {
                // console.log("on clientTestEvent", e.timeSequence);
                testArray.push({
                    receiver: "client",
                    metaObj: e
                });
            }
        });

        serverRuleBinder.applyToInstance(server);
        serverRuleBinder.applyToInstance(serverClient);
        clientRuleBinder.applyToInstance(client);
    }

    let serverOperator = serverRuleBinder.createOperator(serverClient);
    let clientOperator = clientRuleBinder.createOperator(client);

    { // 触发事件
        clientOperator.trigger.serverTestEvent({ timeSequence: 0 });
        serverOperator.trigger.clientTestEvent({ timeSequence: 1 });
        clientOperator.trigger.serverTestEvent({ timeSequence: 2 });
        serverOperator.trigger.clientTestEvent({ timeSequence: 3 });
        clientOperator.trigger.serverTestEvent({ timeSequence: 4 });
        serverOperator.trigger.clientTestEvent({ timeSequence: 5 });
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