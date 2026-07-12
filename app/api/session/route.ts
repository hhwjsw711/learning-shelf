// Sign an existing member's browser in: they visit
//   /api/session?author=<name>&token=<their owner token>
// (both values live in their kit) and get the owner cookie + a redirect to
// the board. For members whose kits predate the cookie, or a new browser.

import { ownerCookieHeader, verifyOwner } from "@/lib/owner";
import { getAuthorRecord } from "@/lib/store";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const author = (url.searchParams.get("author") ?? "").toLowerCase();
  const token = url.searchParams.get("token") ?? "";

  if (!author || !token) {
    return new Response("need ?author= and ?token= (both are in your kit)", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Unlike the write routes, refuse unclaimed authors here — a sign-in must
  // never claim a name as a side effect.
  const record = await getAuthorRecord(author);
  if (!record) {
    return new Response("no such member", { status: 404 });
  }
  const owner = await verifyOwner(author, token);
  if (!owner.ok) {
    return new Response("wrong token", { status: 403 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "set-cookie": ownerCookieHeader(author, token),
    },
  });
}
