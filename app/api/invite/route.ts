// Mint an invite: a paste-into-your-agent installer carrying the three skills
// (shelf contributor + learn + beautiful-html-templates), personalized with
// the friend's name, band style, and a freshly minted owner token that makes
// their corner theirs alone. Gated by the group password.

import { buildInviteInstaller } from "@/lib/invite";
import { hashOwnerToken, mintOwnerToken } from "@/lib/owner";
import { claimAuthor, getAuthorRecord, listDocs } from "@/lib/store";

export async function POST(request: Request): Promise<Response> {
  let body: { name?: string; style?: string; password?: string };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "expected JSON body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // The friend-group gate: minting an installer hands out the upload secret,
  // so prove you belong first. Set INVITE_PASSWORD in the environment.
  const expected = process.env.INVITE_PASSWORD;
  if (!expected) {
    return new Response(
      JSON.stringify({ error: "server is missing INVITE_PASSWORD" }),
      { status: 500, headers: { "content-type": "application/json" } },
    );
  }
  if (String(body.password ?? "") !== expected) {
    return new Response(
      JSON.stringify({ error: "wrong password — ask a friend for the shelf password" }),
      { status: 401, headers: { "content-type": "application/json" } },
    );
  }

  // One corner per name: minting a kit claims the author name and binds a
  // fresh owner token to it. A taken name can't be re-minted — otherwise
  // anyone with the shelf password could grab someone else's corner.
  const rawName = String(body.name ?? "");
  const author = rawName.trim().toLowerCase().split(/\s+/)[0].replace(/[^a-z0-9-]/g, "");
  if (!author) {
    return new Response(JSON.stringify({ error: "give us a name first" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const [record, docs] = await Promise.all([getAuthorRecord(author), listDocs()]);
  const hasDocs = docs.some((d) => d.author.toLowerCase() === author);
  if (record || hasDocs) {
    return new Response(
      JSON.stringify({
        error: `"${author}" already has a corner on the shelf — if it's yours, your original kit still works; otherwise pick another name`,
      }),
      { status: 409, headers: { "content-type": "application/json" } },
    );
  }

  const ownerToken = mintOwnerToken();
  await claimAuthor(author, hashOwnerToken(ownerToken));

  const installer = buildInviteInstaller(
    rawName,
    String(body.style ?? "plain"),
    ownerToken,
  );

  return new Response(JSON.stringify({ installer }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}
