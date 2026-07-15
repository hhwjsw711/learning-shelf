// Mint an invite: a paste-into-your-agent installer carrying the three skills
// (shelf contributor + learn + beautiful-html-templates), personalized with
// the friend's name, band style, and a freshly minted owner token that makes
// their corner theirs alone. Gated by the group password. Multipart so an
// optional polaroid photo can ride along with the claim.

import { randomBytes } from "node:crypto";
import { buildInviteInstaller } from "@/lib/invite";
import { hashOwnerToken, mintOwnerToken, ownerCookieHeader } from "@/lib/owner";
import {
  avatarExtFor,
  claimAuthor,
  getAuthorRecord,
  listDocs,
  saveAuthorProfile,
  setAvatar,
} from "@/lib/store";
import { STYLE_TOKENS } from "@/lib/styleTokens";

const MAX_PHOTO_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: "需要 multipart 表单数据" });
  }

  // The friend-group gate: minting an installer hands out the upload secret,
  // so prove you belong first. Set INVITE_PASSWORD in the environment.
  const expected = process.env.INVITE_PASSWORD;
  if (!expected) {
    return json(500, { error: "服务器缺少 INVITE_PASSWORD" });
  }
  if (String(form.get("password") ?? "") !== expected) {
    return json(401, { error: "密码错误 — 找朋友要布告板密码" });
  }

  // One corner per name: minting a kit claims the author slug and binds a
  // fresh owner token to it. The slug is randomly generated so the user's
  // display name can be any language (Chinese, emoji-free) without worrying
  // about URL-safe characters or collisions.
  const rawName = String(form.get("name") ?? "").trim();
  if (!rawName) {
    return json(400, { error: "请先输入名字" });
  }
  const author = randomBytes(4).toString("hex");

  // Validate the optional polaroid BEFORE claiming, so a bad file doesn't
  // burn the name.
  const photo = form.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!avatarExtFor(photo.type)) {
      return json(400, { error: "照片必须是 png、jpeg、webp 或 gif 格式" });
    }
    if (photo.size > MAX_PHOTO_BYTES) {
      return json(413, { error: "照片超过 50MB — 选一张小一点的" });
    }
  }

  const [record, docs] = await Promise.all([getAuthorRecord(author), listDocs()]);
  const hasDocs = docs.some((d) => d.author.toLowerCase() === author);
  if (record || hasDocs) {
    return json(409, {
      error: "出错了，请重试",
    });
  }

  const ownerToken = mintOwnerToken();
  await claimAuthor(author, hashOwnerToken(ownerToken));

  // On the board immediately — an empty "just joined" corner in their chosen
  // design, no first doc (or even kit install) required.
  const rawStyle = String(form.get("style") ?? "plain");
  const style = STYLE_TOKENS.some((s) => s.id === rawStyle) ? rawStyle : "plain";
  await saveAuthorProfile(author, { name: rawName.trim() || author, style });

  if (photo instanceof File && photo.size > 0) {
    await setAvatar(author, Buffer.from(await photo.arrayBuffer()), photo.type);
  }

  const installer = buildInviteInstaller(rawName, author, style, ownerToken);

  // The minting browser becomes this member's browser: the cookie unlocks
  // their owner controls on the board (add / delete lessons, leave).
  return new Response(JSON.stringify({ installer, author }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "set-cookie": ownerCookieHeader(author, ownerToken),
    },
  });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
