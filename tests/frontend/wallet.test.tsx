import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WalletProvider } from "../../src/components/wallet-provider";
import { SiteHeader } from "../../src/components/site-header";

afterEach(() => { cleanup(); vi.restoreAllMocks(); delete window.ethereum; });

describe("wallet browser flow", () => {
  it("switches to StudioNet before requesting an account", async () => {
    const request = vi.fn(async ({ method }: { method: string; params?: unknown[] }) => {
      if (method === "eth_chainId") return "0x1";
      if (method === "eth_requestAccounts") return ["0x1234567890123456789012345678901234567890"];
      return null;
    });
    window.ethereum = { request };
    render(<WalletProvider><SiteHeader/></WalletProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Connect wallet" }));
    await screen.findByRole("button", { name: "0x1234…7890" });
    expect(request.mock.calls.map(([call]) => call.method)).toEqual(["eth_chainId", "wallet_switchEthereumChain", "eth_requestAccounts"]);
    expect(request.mock.calls[1][0].params).toEqual([{ chainId: "0xf22f" }]);
  });

  it("shows a rejected network switch as a visible error", async () => {
    window.ethereum = { request: vi.fn(async ({ method }) => { if (method === "eth_chainId") return "0x1"; throw new Error("rejected"); }) };
    render(<WalletProvider><SiteHeader/></WalletProvider>);
    fireEvent.click(screen.getByRole("button", { name: "Connect wallet" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("GenLayer StudioNet"));
  });
});
