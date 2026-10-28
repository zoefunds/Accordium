import React from "react";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const chain = vi.hoisted(() => ({
  writeContract: vi.fn(),
  waitFinalized: vi.fn(),
}));

vi.mock("../../src/lib/chain", () => ({
  CONTRACT_ADDRESS: "0x5a21fFd6d5f2010A31Da99e655A5d709C3b7f706",
  writeContract: chain.writeContract,
  waitFinalized: chain.waitFinalized,
}));

import { useTransaction } from "../../src/lib/use-transaction";

function Harness() {
  const tx = useTransaction();
  return <><button onClick={() => void tx.send("Verify", "verify_identity", ["example.com"], "0x7452084e1cf767bf19c743051cff27d9f7a87a4d")}>Send</button><output>{JSON.stringify(tx.transactions)}</output>{tx.error && <p role="alert">{tx.error}</p>}</>;
}

afterEach(() => { cleanup(); vi.resetAllMocks(); });

describe("transaction finality presentation", () => {
  it("marks the real submitted hash failed when finalization rolls back", async () => {
    chain.writeContract.mockResolvedValue("0xabc123");
    chain.waitFinalized.mockRejectedValue(new Error("Finalized transaction rolled back (ERROR)."));
    render(<Harness/>);
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/rolled back/));
    expect(screen.getByText(/0xabc123/).textContent).toMatch(/FAILED/);
    expect(screen.queryByText(/pending-/)).toBeNull();
  });
});
