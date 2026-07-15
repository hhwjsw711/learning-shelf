// Sign an existing member's browser in: they visit
//   /api/session?author=<name>&token=<their owner token>
// (both values live in their kit) and get the owner cookie + a redirect to
// the board. For members whose kits predate the cookie, or a new browser.

import { ownerCookieHeader, verifyOwner } from "@/lib/owner";
import { getAuthorRecord, listJoinedAuthors } from "@/lib/store";

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
    return fail(400, "需要你的名字和 owner token（都在你的工具包里）");
  }

  // The "author" param may be the author slug (hex) or the display name.
  // Try direct slug lookup first; if that fails, search by name (the sign-in
  // form sends the user's name, not their random hex slug).
  let resolvedAuthor = author;
  let record = await getAuthorRecord(author);
  if (!record) {
    const joined = await listJoinedAuthors();
    const match = joined.find(
      (j) => j.name.toLowerCase() === author,
    );
    if (match) {
      resolvedAuthor = match.author;
      record = await getAuthorRecord(resolvedAuthor);
    }
  }
  if (!record) {
    return fail(404, "没有找到这个成员 — 检查名字和密钥是否正确");
  }
  const owner = await verifyOwner(resolvedAuthor, token);
  if (!owner.ok) {
    return fail(403, "密钥不匹配 — 检查你 learning-shelf SKILL.md 里的 x-owner-token 那一行");
  }

  if (wantsJson) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": ownerCookieHeader(resolvedAuthor, token),
      },
    });
  }
  return new Response(null, {
    status: 302,
    headers: {
      location: "/",
      "set-cookie": ownerCookieHeader(resolvedAuthor, token),
    },
  });
}
