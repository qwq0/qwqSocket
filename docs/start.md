# 使用方法

1. 创建上下文

服务端:

```javascript
// 创建服务端
let server = new QwQSocketServer();

// 创建连接到服务端的客户端实例
let serverClient = server.createClient();
```

客户端:

```javascript
// 创建客户端
let client = new QwQSocketClient();
```

---

2. 为上下文建立通信 (使用自定义的下级协议进行数据交换)

每个数据包要求用户实现传递 一个前缀 (字符串) 与 一个 js 对象  
这里的字符串保证不包括 零字符(\0) 所以可以用零字符进行分割前缀与对象

这里演示使用 json 进行数据序列化

服务端:

```javascript
// 当上下文想要发送数据时 发送给客户端
serverClient.sendData.add(e => {
    socket.send(e.prefix + "\0" + JSON.stringify(e));
});
// 收到客户端数据时 传递给上下文
socket.addEventListener("message", e => {
    let separatorIndex = e.data.indexOf("\0");
    serverClient.receiveData(
        e.data.slice(0, separatorIndex),
        JSON.parse(e.data.slice(separatorIndex + 1))
    );
});
```

客户端:

```javascript
// 当上下文想要发送数据时 发送给服务端
client.sendData.add(e => {
    socket.send(e.prefix + "\0" + JSON.stringify(e));
});
// 收到服务端数据时 传递给上下文
socket.addEventListener("message", e => {
    let separatorIndex = e.data.indexOf("\0");
    client.receiveData(
        e.data.slice(0, separatorIndex),
        JSON.parse(e.data.slice(separatorIndex + 1))
    );
});
```

---

3. 创建事件绑定器 用于绑定事件和查询

事件绑定器用于在上下文实例上绑定 事件 与 查询  
绑定的内容包括 事件的规则 和 事件的监听器  
这个内容可以在服务端和客户端之间复用

服务端需要的内容: 服务端事件的 规则 和 监听器, 客户端事件的 规则  
客户端需要的内容: 客户端事件的 规则 和 监听器, 服务端事件的 规则

两端分别需要获取对方的规则用于构建操作器  
因此 事件绑定器的代码可以在服务端和客户端间复用  
复用的内容包括双方的事件(或查询)规则  
之后每个端单独绑定自己的监听器

这些内容在服务端和客户端之间复用:

```javascript
// 分别创建服务端和客户端的绑定器
let serverRuleBinder = RuleBinder.createServerBound();
let clientRuleBinder = RuleBinder.createClientBound();
// 配对绑定器
serverRuleBinder.bindOpposite(clientRuleBinder);

// 绑定各种事件

// 绑定事件的规则 收到事件触发将会自动进行类型检查
serverRuleBinder.addEventRules({
    serverTestEvent: EventRule.create([
        {
            key: "text",
            rule: RuleType.text(),
        },
    ]),
});
```

这些内容应该只写在服务端:

```javascript
// 绑定事件的监听器
serverRuleBinder.setEventListeners({
    serverTestEvent: e => {
        console.log("on serverTestEvent", e.text);
    },
});
```

---

4. 通过操作器调用对方的事件(或查询)

操作器 是从 绑定器 中生成的  
生成时使用改绑定器配对的 对方的绑定器 中的事件规则信息

客户端:

```javascript
// 创建操作器
let clientOperator = clientRuleBinder.createOperator(client);

// 然后使用非常简单的方式调用事件
clientOperator.trigger.serverTestEvent({ text: "Hi!" });
```
