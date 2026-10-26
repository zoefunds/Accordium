import Link from "next/link";
export function SiteFooter() { return <footer><Link className="brand" href="/"><span>AC</span>Accordium</Link><div className="footer-links"><Link href="/registry">Registry</Link><Link href="/protocol">Protocol</Link><Link href="/security">Security</Link></div><span className="mono">STUDIONET / 2026</span></footer>; }
