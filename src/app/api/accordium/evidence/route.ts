import { createHash } from "node:crypto";
export const runtime = "nodejs";
const MAX_BYTES = 180_000;
export function archiveStamp(source:string, locator:string, target:string):string {
  const prefix = source === "WAYBACK" ? "https://web.archive.org/web/" : source === "ARQUIVO_PT" ? "https://arquivo.pt/wayback/" : "";
  if (source === "SIGNED_ORIGIN") { if (locator !== target) throw new Error("Signed-origin evidence must use the exact pact URL."); return new Date().toISOString().replace(/\D/g,"").slice(0,14); }
  if (!prefix || !locator.startsWith(prefix)) throw new Error("Locator does not match the selected archive.");
  const tail=locator.slice(prefix.length), stamp=tail.slice(0,14); if(!/^\d{14}$/.test(stamp)) throw new Error("Archive locator must contain a 14-digit timestamp.");
  let rest=tail.slice(14); if(rest.startsWith("id_/"))rest=rest.slice(4);else if(rest.startsWith("/"))rest=rest.slice(1); if(rest!==target)throw new Error("Archive locator is not for this pact URL."); return stamp;
}
export async function POST(request:Request){try{const {source,locator,target_url}=await request.json() as Record<string,string>; if(!["WAYBACK","ARQUIVO_PT","SIGNED_ORIGIN"].includes(source))return Response.json({error:"Unsupported source."},{status:400}); const captured_at=archiveStamp(source,locator,target_url); const response=await fetch(locator,{headers:{"accept-encoding":"identity"},cache:"no-store"}); if(!response.ok)throw new Error(`Evidence source returned HTTP ${response.status}.`); const bytes=new Uint8Array(await response.arrayBuffer()); if(bytes.length>MAX_BYTES)throw new Error("Evidence exceeds the 180 KB admission limit."); const body=new TextDecoder("utf-8",{fatal:true}).decode(bytes); const digest=createHash("sha256").update(body,"utf8").digest("hex"); return Response.json({claim:{source,target_url,locator,captured_at,digest},preview:body.slice(0,500),bytes:bytes.length});}catch(error){return Response.json({error:error instanceof Error?error.message:"Evidence preparation failed."},{status:400})}}
