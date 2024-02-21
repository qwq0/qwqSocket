import { QwQSocketServer } from "../src/server/QwQSocketServer.js";
import { QwQSocketClient } from "../src/client/QwQSocketClient.js";
import { EventRule } from "../src/rule/EventRule.js";
import { RuleType } from "../src/rule/RuleType.js";
import { RuleBinder } from "../src/binder/RuleBinder.js";

test("query bind test", async () =>
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
        serverRuleBinder.addQueryRule(
            "serverTestQuery",
            EventRule.create([
                {
                    key: "a",
                    rule: RuleType.number()
                },
                {
                    key: "b",
                    rule: RuleType.number()
                }
            ]),
            EventRule.create([
                {
                    key: "ans",
                    rule: RuleType.number()
                }
            ])
        );
        serverRuleBinder.setQueryProcessor("serverTestQuery", e =>
        {
            return {
                ans: e.a + e.b
            };
        });
        clientRuleBinder.addQueryRule(
            "clientTestQuery",
            EventRule.create([
                {
                    key: "a",
                    rule: RuleType.number()
                },
                {
                    key: "b",
                    rule: RuleType.number()
                }
            ]),
            EventRule.create([
                {
                    key: "ans",
                    rule: RuleType.number()
                }
            ])
        );
        clientRuleBinder.setQueryProcessor("clientTestQuery", e =>
        {
            return {
                ans: e.a - e.b
            };
        });

        serverRuleBinder.applyToInstance(server);
        serverRuleBinder.applyToInstance(serverClient);
        clientRuleBinder.applyToInstance(client);
    }

    let serverOperator = serverRuleBinder.createOperator(serverClient);
    let clientOperator = clientRuleBinder.createOperator(client);

    { // 调用查询
        expect(await clientOperator.query.serverTestQuery({ a: 1, b: 2 })).toStrictEqual({ ans: 3 });
        expect(await serverOperator.query.clientTestQuery({ a: 3, b: 2 })).toStrictEqual({ ans: 1 });
    }

    /**
     * @type {(x: any) => void}
     */
    let done = null;

    { // 进行测试
        setTimeout(() =>
        {
            done();
        }, 1000);
    }

    return new Promise(resolve => { done = resolve; });
});