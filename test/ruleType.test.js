import { RuleType } from "../src/data/RuleType.js";

test("number -> pass", () =>
{
    expect(RuleType.number().verify(0)).toBe(true);
    expect(RuleType.number().verify(1)).toBe(true);
    expect(RuleType.number().verify(-1)).toBe(true);
    expect(RuleType.number().verify(114514)).toBe(true);
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
});

test("string -> pass", () =>
{
    expect(RuleType.string().verify("")).toBe(true);
    expect(RuleType.string().verify("1")).toBe(true);
    expect(RuleType.string().verify("a")).toBe(true);
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
});

test("array -> block", () =>
{
    expect(RuleType.array([]).verify([1])).toBe(false);
    expect(RuleType.array([RuleType.number()]).verify(["a"])).toBe(false);
    expect(RuleType.array([RuleType.string()], RuleType.number()).verify([0, 1, 2, 3, 4, 5])).toBe(false);
    expect(RuleType.array([RuleType.string()], RuleType.number()).verify(["a", 1, 2, "3", 4, 5])).toBe(false);
    expect(RuleType.array([], RuleType.number()).verify([1, 2, 3, "a", 5])).toBe(false);
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