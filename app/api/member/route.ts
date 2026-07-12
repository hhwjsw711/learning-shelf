// Leave the board: a member (authed by their owner cookie, or an agent with
// secret + owner token headers) removes their whole corner — every doc, the
// polaroid, and the author record. The freed name can be claimed again.

import {
  clearOwnerCookieHeader,
  ownerTokenFrom,
  parseOwnerCookie,
  verifyOwner,
} from "@/lib/owner";
import {
  deleteAuthorRecord,
  deleteAvatar,
  deleteDoc,
  listDocs,
} from "@/lib/store";

export async function DELETE(request: Request): Promise<Response> {
  const cookie = parseOwnerCookie(request);
  const author = (
    new URL(request.url).searchParams.get("author") ??
    cookie?.author ??
    ""
  ).toLowerCase();

  if (!author) {
    return json(400, { error: "no author — sign in (mint a kit) or pass ?author=" });
  }

  const secret = process.env.SHELF_SECRET;
  const hasSecret = Boolean(secret) && request.headers.get("x-shelf-secret") === secret;
  if (!hasSecret && !cookie) {
    return json(401, { error: "not signed in and no x-shelf-secret header" });
  }

  const owner = await verifyOwner(author, ownerTokenFrom(request, author));
  if (!owner.ok) return json(owner.status, { error: owner.error });

  const docs = (await listDocs()).filter(
    (d) => d.author.toLowerCase() === author,
  );
  for (const doc of docs) {
    await deleteDoc(doc.slug);
  }
  await deleteAvatar(author);
  await deleteAuthorRecord(author);

  return new Response(
    JSON.stringify({ ok: true, removed: author, docsDeleted: docs.length }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "set-cookie": clearOwnerCookieHeader(),
      },
    },
  );
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
