import { describe, expect, it } from "vitest";
import { archiveStamp } from "../../src/app/api/accordium/evidence/route";

describe("evidence admission", () => {
  const origin = "https://publisher.example/commitment";

  it("binds a Wayback capture to the exact pact URL and timestamp", () => {
    expect(archiveStamp("WAYBACK", `https://web.archive.org/web/20261025112233id_/${origin}`, origin)).toBe("20261025112233");
  });

  it("rejects unrelated archive content", () => {
    expect(() => archiveStamp("ARQUIVO_PT", "https://arquivo.pt/wayback/20261025112233/https://other.example/page", origin)).toThrow(/not for this pact URL/);
  });

  it("requires a metadata timestamp in archive locators", () => {
    expect(() => archiveStamp("WAYBACK", `https://web.archive.org/web/latest/${origin}`, origin)).toThrow(/14-digit timestamp/);
  });

  it("binds live evidence to the exact origin", () => {
    expect(() => archiveStamp("SIGNED_ORIGIN", "https://publisher.example/other", origin)).toThrow(/exact pact URL/);
  });
});
