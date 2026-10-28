import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ lookup: vi.fn() }));
vi.mock("node:dns/promises", () => ({ lookup: mocks.lookup }));

import { fetchBoundedArchive } from "../../src/lib/safe-evidence";

describe("bounded archive retrieval", () => {
  beforeEach(() => {
    mocks.lookup.mockReset();
    mocks.lookup.mockResolvedValue([{ address: "207.241.237.3", family: 4 }]);
    vi.restoreAllMocks();
  });

  it("rejects archive DNS rebinding to a private address", async () => {
    mocks.lookup.mockResolvedValue([{ address: "127.0.0.1", family: 4 }]);
    await expect(fetchBoundedArchive("https://web.archive.org/web/20261025112233/https://publisher.example/page", "WAYBACK"))
      .rejects.toThrow(/non-public/);
  });

  it("rejects redirects away from the approved archive", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 302, headers: { location: "https://127.0.0.1/private" } })));
    await expect(fetchBoundedArchive("https://web.archive.org/web/20261025112233/https://publisher.example/page", "WAYBACK"))
      .rejects.toThrow(/authorized destination/);
  });

  it("enforces the streaming body limit even without Content-Length", async () => {
    const body = new Uint8Array(180_001);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(body, { status: 200 })));
    await expect(fetchBoundedArchive("https://web.archive.org/web/20261025112233/https://publisher.example/page", "WAYBACK"))
      .rejects.toThrow(/180 KB/);
  });

  it("returns bounded UTF-8 archive text", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("verified archive body", { status: 200 })));
    await expect(fetchBoundedArchive("https://arquivo.pt/wayback/20261025112233/https://publisher.example/page", "ARQUIVO_PT"))
      .resolves.toBe("verified archive body");
  });
});
