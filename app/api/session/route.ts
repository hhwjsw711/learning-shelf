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

  const wantsJson = url.searchParams.get("json") === "1";
  const fail = (status: number, message: string) =>
    wantsJson
      ? new Response(JSON.stringify({ error: message }), {
          status,
          headers: { "content-type": "application/json" },
        })
      : new Response(message, {
          status,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });

  if (!author || !token) {
    return fail(400, "need your name and your owner token (both are in your kit)");
  }

  // Unlike the write routes, refuse unclaimed authors here — a sign-in must
  // never claim a name as a side effect.
  const record = await getAuthorRecord(author);
  if (!record) {
    return fail(404, `no member named "${author}" on this board`);
  }
  const owner = await verifyOwner(author, token);
  if (!owner.ok) {
    return fail(403, "that token doesn't match — check the x-owner-token line in your learning-shelf SKILL.md");
  }

  if (wantsJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": ownerCookieHeader(author, token),
      },
    });
  }
  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "set-cookie": ownerCookieHeader(author, token),
    },
  });
}
