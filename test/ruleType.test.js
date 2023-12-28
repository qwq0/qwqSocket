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
    expect(RuleType.number().verify(Symbol)).toBe(false);
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
    expect(RuleType.string().verify(Symbol)).toBe(false);
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
    expect(RuleType.boolean().verify(Symbol)).toBe(false);
    expect(RuleType.boolean().verify({})).toBe(false);
    expect(RuleType.boolean().verify([])).toBe(false);
    expect(RuleType.boolean().verify(BigInt(0))).toBe(false);
    expect(RuleType.boolean().verify(null)).toBe(false);
    expect(RuleType.boolean().verify(undefined)).toBe(false);
});