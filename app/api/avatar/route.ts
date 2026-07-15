// Set (or replace) an author's polaroid: one small image per author, shown
// pinned over their paper section on the board. Same shared secret as
// publishing.
//
//   curl -X POST $SHELF_URL/api/avatar \
//     -H "x-shelf-secret: $SECRET" \
//     -F author=noah -F image=@me.jpg

import { avatarExtFor, setAvatar } from "@/lib/store";
import { verifyOwner } from "@/lib/owner";

const AUTHOR_PATTERN = /^[a-z0-9][a-z0-9-]{0,59}$/;
// Generous on purpose — in practice the host caps request bodies (~4.5MB on
// Vercel serverless) well before this, so ours is just a sanity backstop.
const MAX_IMAGE_BYTES = 50 * 1024 * 1024;

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.SHELF_SECRET;

  if (!secret) {
    return json(500, { error: "服务器缺少 SHELF_SECRET" });
  }
  if (request.headers.get("x-shelf-secret") !== secret) {
    return json(401, { error: "x-shelf-secret 头部无效或缺失" });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { error: "需要 multipart 表单数据" });
  }

  const author = String(form.get("author") ?? "").toLowerCase();
  const image = form.get("image");

  if (!AUTHOR_PATTERN.test(author)) {
    return json(400, { error: "author 必须匹配 " + String(AUTHOR_PATTERN) });
  }
  if (!(image instanceof File)) {
    return json(400, { error: "需要图片文件（-F image=@photo.jpg）" });
  }
  if (!avatarExtFor(image.type)) {
    return json(400, { error: "图片必须是 png、jpeg、webp 或 gif 格式" });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return json(413, { error: "图片超过 50MB — 先缩小" });
  }

  // Only the corner's owner can hang (or replace) its polaroid.
  const owner = await verifyOwner(author, request.headers.get("x-owner-token") ?? "");
  if (!owner.ok) return json(owner.status, { error: owner.error });

  await setAvatar(author, Buffer.from(await image.arrayBuffer()), image.type);

  return json(200, { ok: true, url: `/a/${author}` });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
