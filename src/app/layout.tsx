import type { Metadata } from "next";
import "./globals.css";
import "./runtime.css";
import "./actions.css";
import "./professional.css";
import "./mobile-nav.css";
import { WalletProvider } from "@/components/wallet-provider";

export const metadata: Metadata = { title: "Accordium", description: "Evidence-diverse commitment assurance on GenLayer" };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><WalletProvider><div className="noise" />{children}</WalletProvider></body></html>;
}
