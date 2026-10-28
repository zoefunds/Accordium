import { describe, expect, it } from "vitest";
import { validateArchiveLocator } from "../../src/lib/safe-evidence";

describe("evidence admission", () => {
  const origin = "https://publisher.example/commitment";

  it("binds a Wayback capture to the exact pact URL and timestamp", () => {
    expect(validateArchiveLocator("WAYBACK", `https://web.archive.org/web/20261025112233id_/${origin}`, origin)).toBe("20261025112233");
  });

  it("rejects unrelated archive content", () => {
    expect(() => validateArchiveLocator("ARQUIVO_PT", "https://arquivo.pt/wayback/20261025112233/https://other.example/page", origin)).toThrow(/not for this pact URL/);
  });

  it("requires a metadata timestamp in archive locators", () => {
    expect(() => validateArchiveLocator("WAYBACK", `https://web.archive.org/web/latest/${origin}`, origin)).toThrow(/14-digit timestamp/);
  });

  it("rejects retired and unapproved evidence adapters", () => {
    expect(() => validateArchiveLocator("SIGNED_ORIGIN", origin, origin)).toThrow(/approved archive/);
  });

  it("rejects archive host and credential spoofing", () => {
    expect(() => validateArchiveLocator("WAYBACK", `https://web.archive.org.evil.test/web/20261025112233/${origin}`, origin)).toThrow(/approved archive/);
    expect(() => validateArchiveLocator("WAYBACK", `https://attacker@web.archive.org/web/20261025112233/${origin}`, origin)).toThrow(/approved archive|authorized/);
  });
});
