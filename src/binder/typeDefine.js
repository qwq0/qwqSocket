import { RuleBinder } from "./RuleBinder.js";

/**
 * 逐行添加缩进
 * @param {string} str
 * @param {number} level
 * @param {boolean} ignoreFirstLine
 * @returns {string}
 */
function addIndent(str, level = 1, ignoreFirstLine = false)
{
    let indent = "";
    for (let i = 0; i < level; i++)
        indent += "    ";
    return str.split("\n").map((o, i) => (ignoreFirstLine && i == 0 ? o : indent + o)).join("\n");
}

/**
 * 给字符串收尾添加引号
 * @param {string} str
 * @returns {string}
 */
function strQuote(str)
{
    if (typeof (str) != "string")
        throw "strQuote param is not string";
    return JSON.stringify(str);
}

/**
 * 通过绑定器生成类型定义文件
 * @param {RuleBinder} serverBinder
 * @param {RuleBinder} clientBinder
 * @param {{ 
 *  extend?: {
 *      lisienerBind?: boolean,
 *      lisienerBindType?: "type" | "interface" | "namespace",
 *      importModuleName?: string,
 *      importClientType?: boolean
 *  },
 *  preset?: {
 *      lisienerBind?: boolean | "type" | "interface" | "namespace"
 *  }
 * }} [options]
 * @returns {string}
 */
export function getTypeDefineByBinder(serverBinder, clientBinder, options = {})
{
    options = Object.assign({}, options);
    for (let key of ["extend", "preset"])
    {
        if (options[key])
            options[key] = Object.assign({}, options[key]);
        else
            options[key] = {};
    }

    // 预设配置
    if (options.preset.lisienerBind)
    {
        options.extend.lisienerBind = true;
        options.extend.importClientType = true;
        if (typeof (options.preset.lisienerBind) == "string")
            options.extend.lisienerBindType = options.preset.lisienerBind;
        else
            options.extend.lisienerBindType = "type";
    }

    let serverDefine = serverBinder.genTypeDefine();
    let clientDefine = clientBinder.genTypeDefine();

    let ret = "";
    let separator = "\n\n";

    // --- 事件类型 ---

    ret += ([
        "export type serverBinderEventMap = {",
        serverDefine.event.map(o => addIndent(`${o.name}: ${o.metaType};`)).join("\n"),
        "};"
    ]).join("\n") + separator;

    ret += ([
        "export type serverBinderQueryMap = {",
        addIndent(
            serverDefine.query.map(o => ([
                `${o.name}: {`,
                addIndent(`req: ${o.reqType};`),
                addIndent(`rsp: ${o.rspType};`),
                `};`
            ]).join("\n")).join("\n")
        ),
        "};"
    ]).join("\n") + separator;


    ret += ([
        "export type clientBinderEventMap = {",
        clientDefine.event.map(o => addIndent(`${o.name}: ${o.metaType};`)).join("\n"),
        "};"
    ]).join("\n") + separator;

    ret += ([
        "export type clientBinderQueryMap = {",
        addIndent(
            clientDefine.query.map(o => ([
                `${o.name}: {`,
                addIndent(`req: ${o.reqType};`),
                addIndent(`rsp: ${o.rspType};`),
                `};`
            ]).join("\n")).join("\n"),
        ),
        "};"
    ]).join("\n") + separator;

    // --- 操作器 ---

    let extendContent = ([
        "export interface ServerSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof clientBinderEventMap]?: (e: clientBinderEventMap[K]) => void;",
        "    };",
        "    query: {",
        `        [K in keyof clientBinderQueryMap]?: (e: clientBinderQueryMap[K]["req"]) => Promise<clientBinderQueryMap[K]["rsp"]>;`,
        "    };",
        "}",
        "",
        "export interface ClientSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof serverBinderEventMap]?: (e: serverBinderEventMap[K]) => void;",
        "    };",
        "    query: {",
        `        [K in keyof serverBinderQueryMap]?: (e: serverBinderQueryMap[K]["req"]) => Promise<serverBinderQueryMap[K]["rsp"]>;`,
        "    };",
        "}",
        ""
    ]);

    // --- 扩展内容 ---

    if (options.extend.importClientType)
    { // 导入客户端类型
        let importModule = options.extend.importModuleName;
        if (!importModule)
        {
            importModule = "qwq-socket";
        }
        extendContent.push(...([
            `type QwQSocketClient = import(${strQuote(importModule)}).QwQSocketClient;`,
            `type QwQSocketServerClient = import(${strQuote(importModule)}).QwQSocketServerClient;`,
            ""
        ]));
    }

    if (options.extend.lisienerBind)
    { // 监听器绑定

        /**
         * 监听器类型块
         * @param {"Server" | "Client"} direction
         * @param {"event" | "query"} oper
         * @param {"type" | "interface" | "namespace"} type
         * @returns {string}
         */
        function listenerTypeBlock(direction, oper, type)
        {
            let useTypeName = `${direction == "Server" ? "server" : "client"}Binder${oper == "query" ? "Query" : "Event"}Map`;

            /**
             * 监听器类型单行
             * @param {string} name
             * @returns {string}
             */
            function listenerFunctionType(name)
            {
                return (
                    `(e: ${useTypeName}[${name}]${oper == "query" ? `["req"]` : ""}, client: ${direction == "Server" ? "QwQSocketServerClient" : "QwQSocketClient"})` +
                    ` => ${oper == "query" ? `${useTypeName}[K]["rsp"] | Promise<${useTypeName}[K]["rsp"]>` : "void"}`
                );
            }

            /**
             * 监听器类型行
             * @returns {string}
             */
            function listenerTypeLines()
            {
                if (type == "type")
                {
                    return `    [K in keyof ${useTypeName}]?: ${listenerFunctionType("K")};`;
                }
                else
                {
                    let arr = (direction == "Server" ? serverDefine : clientDefine)[oper];
                    return arr.map((/** @type {{ name: string; }} */ o) =>
                        `    ${type == "interface" ? `${o.name}:` : `type ${o.name} =`} ${listenerFunctionType(strQuote(o.name))};`
                    ).join("\n");
                }
            }

            return ([
                `export ${type} ${direction}Bind${oper == "query" ? "QueryProcessor" : "EventLisiener"}${type == "type" ? " = " : "\n"}{`,
                listenerTypeLines(),
                "}"
            ]).join("\n");
        }

        let exportType = options.extend.lisienerBindType;
        if (!exportType)
        {
            exportType = "type";
        }

        extendContent.push(...([
            listenerTypeBlock("Server", "event", exportType),
            "",
            listenerTypeBlock("Server", "query", exportType),
            "",
            listenerTypeBlock("Client", "event", exportType),
            "",
            listenerTypeBlock("Client", "query", exportType),
            ""
        ]));
    }

    ret += extendContent.join("\n") + separator;
    return ret;
}