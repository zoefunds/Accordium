export const dynamic = "force-static";

export function GET() {
  return Response.json({
    wallet: "0x7452084e1cf767bf19c743051cff27d9f7a87a4d",
    challenge: "385fd0cb309fc15985f653e6f3b06e0175850810908b06e187ea29a679a746fc",
  });
}
