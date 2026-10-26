import { describe, expect, it } from "vitest";
import { challengeBond, shorten, stateLabel } from "../../src/lib/protocol";
describe("protocol presentation", () => {
  it("uses human state labels", () => expect(stateLabel("REFUNDED")).toBe("Safety refund"));
  it("bounds long public values", () => expect(shorten("abcdefghijklmnopqrstuvwxyz", 10)).toBe("abcdefghi…"));
  it("preserves short values", () => expect(shorten("ACD-1", 10)).toBe("ACD-1"));
  it("matches the contract challenge bond floor", () => { expect(challengeBond("5")).toBe(1n); expect(challengeBond("100")).toBe(10n); });
});
