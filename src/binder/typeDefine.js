import { RuleBinder } from "./RuleBinder.js";

/**
 * @param {string} str
 * @param {number} level
 * @param {boolean} ignoreFirstLine
 */
function addIndent(str, level, ignoreFirstLine)
{
    let indent = "";
    for (let i = 0; i < level; i++)
        indent += "    ";
    return str.split("\n").map((o, i) => (ignoreFirstLine && i == 0 ? o : indent + o)).join("\n");
}

/**
 * 通过绑定器生成类型定义文件
 * @param {RuleBinder} serverBinder
 * @param {RuleBinder} clientBinder
 * @returns {string}
 */
export function getTypeDefineByBinder(serverBinder, clientBinder)
{
    let serverDefine = serverBinder.genTypeDefine();
    let clientDefine = clientBinder.genTypeDefine();

    let ret = "";
    let separator = "\n\n";
    let indentation = "    ";

    ret += ([
        "export type serverBinderEventMap = {",
        serverDefine.event.map(o => `${indentation}${o.name}: ${addIndent(o.metaType, 1, true)};`).join("\n"),
        "}"
    ]).join("\n") + separator;
    ret += ([
        "export type serverBinderQueryMap = {",
        serverDefine.query.map(o => ([
            `${indentation}${o.name}: {`,
            `${indentation}${indentation}req: ${addIndent(o.reqType, 2, true)};`,
            `${indentation}${indentation}rsp: ${addIndent(o.rspType, 2, true)};`,
            `${indentation}};`
        ]).join("\n")).join("\n"),
        "}"
    ]).join("\n") + separator;


    ret += ([
        "export type clientBinderEventMap = {",
        clientDefine.event.map(o => `${indentation}${o.name}: ${addIndent(o.metaType, 1, true)};`).join("\n"),
        "}"
    ]).join("\n") + separator;
    ret += ([
        "export type clientBinderQueryMap = {",
        clientDefine.query.map(o => ([
            `${indentation}${o.name}: {`,
            `${indentation}${indentation}req: ${addIndent(o.reqType, 2, true)};`,
            `${indentation}${indentation}rsp: ${addIndent(o.rspType, 2, true)};`,
            `${indentation}};`
        ]).join("\n")).join("\n"),
        "}"
    ]).join("\n") + separator;

    ret += ([
        "export interface ServerSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof clientBinderEventMap]?: (e: clientBinderEventMap[K]) => void",
        "    };",
        "    query: {",
        `        [K in keyof clientBinderQueryMap]?: (e: clientBinderQueryMap[K]["req"]) => Promise<clientBinderQueryMap[K]["rsp"]>`,
        "    };",
        "}",
        "",
        "export interface ClientSocketOperator",
        "{",
        "    trigger: {",
        "        [K in keyof serverBinderEventMap]?: (e: serverBinderEventMap[K]) => void",
        "    };",
        "    query: {",
        `        [K in keyof serverBinderQueryMap]?: (e: serverBinderQueryMap[K]["req"]) => Promise<serverBinderQueryMap[K]["rsp"]>`,
        "    };",
        "}",
    ]).join("\n") + separator;

    return ret;
}