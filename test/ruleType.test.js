import { RuleType } from "../src/rule/RuleType.js";

test("number -> pass", () =>
{
    expect(RuleType.number().verify(0)).toBe(true);
    expect(RuleType.number().verify(1)).toBe(true);
    expect(RuleType.number().verify(-1)).toBe(true);
    expect(RuleType.number().verify(114514)).toBe(true);

    expect(RuleType.integer().verify(114514)).toBe(true);
    expect(RuleType.finite().verify(114.514)).toBe(true);
    expect(RuleType.finite().verify(0)).toBe(true);
    expect(RuleType.integerRange(0, 2).verify(1)).toBe(true);
    expect(RuleType.finiteRange(0, 2).verify(1)).toBe(true);
    expect(RuleType.nonnegativeInteger().verify(0)).toBe(true);
    expect(RuleType.nonnegativeInteger().verify(1)).toBe(true);
});
test("number -> block", () =>
{
    expect(RuleType.number().verify("0")).toBe(false);
    expect(RuleType.number().verify("1.1")).toBe(false);
    expect(RuleType.number().verify(true)).toBe(false);
    expect(RuleType.number().verify(false)).toBe(false);
    expect(RuleType.number().verify(Symbol())).toBe(false);
    expect(RuleType.number().verify({})).toBe(false);
    expect(RuleType.number().verify([])).toBe(false);
    expect(RuleType.number().verify(BigInt(0))).toBe(false);
    expect(RuleType.number().verify(null)).toBe(false);
    expect(RuleType.number().verify(undefined)).toBe(false);

    expect(RuleType.integer().verify(114.514)).toBe(false);
    expect(RuleType.finite().verify(Infinity)).toBe(false);
    expect(RuleType.integerRange(0, 2).verify(3)).toBe(false);
    expect(RuleType.finiteRange(0, 2).verify(3)).toBe(false);
    expect(RuleType.nonnegativeInteger().verify(-1)).toBe(false);
});


test("bigint -> pass", () =>
{
    expect(RuleType.bigint().verify(0n)).toBe(true);
    expect(RuleType.bigint().verify(BigInt(1))).toBe(true);
    expect(RuleType.bigint().verify(-114514191981011451419198101145141919810n)).toBe(true);
});
test("bigint -> block", () =>
{
    expect(RuleType.string().verify(0)).toBe(false);
    expect(RuleType.string().verify(1.1)).toBe(false);
    expect(RuleType.string().verify(true)).toBe(false);
    expect(RuleType.string().verify(false)).toBe(false);
    expect(RuleType.string().verify(Symbol())).toBe(false);
    expect(RuleType.string().verify({})).toBe(false);
    expect(RuleType.string().verify([])).toBe(false);
    expect(RuleType.string().verify(null)).toBe(false);
    expect(RuleType.string().verify(undefined)).toBe(false);
});


test("string -> pass", () =>
{
    expect(RuleType.string().verify("")).toBe(true);
    expect(RuleType.string().verify("1")).toBe(true);
    expect(RuleType.string().verify("a")).toBe(true);

    expect(RuleType.stringWithLength(1, 3).verify("1")).toBe(true);
    expect(RuleType.stringWithLength(1, 3).verify("12")).toBe(true);
    expect(RuleType.stringWithLength(1, 3).verify("123")).toBe(true);
});
test("string -> block", () =>
{
    expect(RuleType.string().verify(0)).toBe(false);
    expect(RuleType.string().verify(1.1)).toBe(false);
    expect(RuleType.string().verify(true)).toBe(false);
    expect(RuleType.string().verify(false)).toBe(false);
    expect(RuleType.string().verify(Symbol())).toBe(false);
    expect(RuleType.string().verify({})).toBe(false);
    expect(RuleType.string().verify([])).toBe(false);
    expect(RuleType.string().verify(BigInt(0))).toBe(false);
    expect(RuleType.string().verify(null)).toBe(false);
    expect(RuleType.string().verify(undefined)).toBe(false);

    expect(RuleType.stringWithLength(1, 3).verify(1)).toBe(false);
    expect(RuleType.stringWithLength(1, 3).verify("")).toBe(false);
    expect(RuleType.stringWithLength(1, 3).verify("1234")).toBe(false);
});


test("boolean -> pass", () =>
{
    expect(RuleType.boolean().verify(true)).toBe(true);
    expect(RuleType.boolean().verify(false)).toBe(true);
});
test("boolean -> block", () =>
{
    expect(RuleType.boolean().verify(0)).toBe(false);
    expect(RuleType.boolean().verify(1.1)).toBe(false);
    expect(RuleType.boolean().verify("")).toBe(false);
    expect(RuleType.boolean().verify("a")).toBe(false);
    expect(RuleType.boolean().verify(Symbol())).toBe(false);
    expect(RuleType.boolean().verify({})).toBe(false);
    expect(RuleType.boolean().verify([])).toBe(false);
    expect(RuleType.boolean().verify(BigInt(0))).toBe(false);
    expect(RuleType.boolean().verify(null)).toBe(false);
    expect(RuleType.boolean().verify(undefined)).toBe(false);
});


test("object -> pass", () =>
{
    expect(RuleType.object({}).verify({})).toBe(true);
    expect(RuleType.object({}, { test1: RuleType.number() }).verify({ test1: 0 })).toBe(true);
    expect(RuleType.object({ test1: RuleType.number() }).verify({ test1: 0 })).toBe(true);
    expect(RuleType.object({ test1: RuleType.number() }, { test2: RuleType.number() }).verify({ test1: 0 })).toBe(true);
    expect(RuleType.object({ test1: RuleType.number() }, { test2: RuleType.number() }).verify({ test1: 0, test2: 0 })).toBe(true);
});
test("object -> block", () =>
{
    expect(RuleType.object({}).verify({ test1: 0 })).toBe(false);
    expect(RuleType.object({}, {}).verify({ test1: "a" })).toBe(false);
    expect(RuleType.object({}, { test1: RuleType.number() }).verify({ test1: "a" })).toBe(false);
    expect(RuleType.object({ test1: RuleType.number() }).verify({})).toBe(false);
});


test("array -> pass", () =>
{
    expect(RuleType.array([]).verify([])).toBe(true);
    expect(RuleType.array([RuleType.number()]).verify([1])).toBe(true);
    expect(RuleType.array([RuleType.string()], RuleType.number()).verify(["a", 1, 2, 3, 4, 5])).toBe(true);
    expect(RuleType.array([], RuleType.number()).verify([1, 2, 3, 4, 5])).toBe(true);

    expect(RuleType.arrayWithLength([], RuleType.number(), 0, 3).verify([1, 2, 3])).toBe(true);
});
test("array -> block", () =>
{
    expect(RuleType.array([]).verify([1])).toBe(false);
    expect(RuleType.array([RuleType.number()]).verify(["a"])).toBe(false);
    expect(RuleType.array([RuleType.string()], RuleType.number()).verify([0, 1, 2, 3, 4, 5])).toBe(false);
    expect(RuleType.array([RuleType.string()], RuleType.number()).verify(["a", 1, 2, "3", 4, 5])).toBe(false);
    expect(RuleType.array([], RuleType.number()).verify([1, 2, 3, "a", 5])).toBe(false);

    expect(RuleType.arrayWithLength([], RuleType.number(), 0, 3).verify([1, 2, 3, 4, 5])).toBe(false);
});


test("enum -> pass", () =>
{
    expect(RuleType.enum([1, 2, 3]).verify(1)).toBe(true);
    expect(RuleType.enum([1, 2, 3]).verify(2)).toBe(true);
    expect(RuleType.enum([1, 2, 3]).verify(3)).toBe(true);
    expect(RuleType.enum([1, 2, "3"]).verify("3")).toBe(true);
});
test("enum -> block", () =>
{
    expect(RuleType.enum([1, 2, 3]).verify(4)).toBe(false);
    expect(RuleType.enum([1, 2, 3]).verify("3")).toBe(false);
});


test("Map -> pass", () =>
{
    expect(RuleType.classMap().verify(new Map())).toBe(true);
    expect(RuleType.classMap(RuleType.number(), RuleType.string()).verify(new Map([
        [1, "a"],
        [2, "b"]
    ]))).toBe(true);
});
test("Map -> block", () =>
{
    expect(RuleType.classMap().verify({})).toBe(false);
    // @ts-ignore
    expect(RuleType.classMap(RuleType.number(), RuleType.string()).verify(new Map([
        [1, "a"],
        [2, 0]
    ]))).toBe(false);
    // @ts-ignore
    expect(RuleType.classMap(RuleType.number(), RuleType.string()).verify(new Map([
        [1, "a"],
        ["2", "b"]
    ]))).toBe(false);
});


test("Set -> pass", () =>
{
    expect(RuleType.classSet().verify(new Set())).toBe(true);
    expect(RuleType.classSet(RuleType.number()).verify(new Set([1, 2, 3]))).toBe(true);
});
test("Set -> block", () =>
{
    expect(RuleType.classSet().verify({})).toBe(false);
    expect(RuleType.classSet(RuleType.number()).verify(new Set([1, 2, "3"]))).toBe(false);
});


test("Uint8Array -> pass", () =>
{
    expect(RuleType.classUint8Array().verify(new Uint8Array())).toBe(true);
    expect(RuleType.classUint8Array().verify(new Uint8Array([0, 1, 2]))).toBe(true);
});
test("Uint8Array -> block", () =>
{
    expect(RuleType.classUint8Array().verify([])).toBe(false);
    expect(RuleType.classUint8Array().verify([0, 1, 2])).toBe(false);
    expect(RuleType.classUint8Array().verify(new Set())).toBe(false);
});



test("null and undefined", () =>
{
    expect(RuleType.null().verify(null)).toBe(true);
    expect(RuleType.undefined().verify(undefined)).toBe(true);

    expect(RuleType.null().verify(undefined)).toBe(false);
    expect(RuleType.undefined().verify(null)).toBe(false);
});