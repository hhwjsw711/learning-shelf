// "I'm here!" — a new member's agent calls this once while installing the
// kit, before any doc exists. It stamps the member's name + band style onto
// their author record, which puts an empty corner on the board immediately.
// Re-calling is harmless (it just refreshes name/style).
//
//   curl -X POST $SHELF_URL/api/join \
//     -H "x-shelf-secret: $SECRET" -H "x-owner-token: $MY_TOKEN" \
//     -F author=sam -F "name=Sam" -F style=daisy-days

import { verifyOwner } from "@/lib/owner";
import { saveAuthorProfile } from "@/lib/store";
import { STYLE_TOKENS } from "@/lib/styleTokens";

const AUTHOR_PATTERN = /^[a-z0-9][a-z0-9-]{0,59}$/;

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
  const name = String(form.get("name") ?? "").slice(0, 40).trim() || author;
  const style = String(form.get("style") ?? "plain").slice(0, 60);

  if (!AUTHOR_PATTERN.test(author)) {
    return json(400, { error: "author 必须匹配 " + String(AUTHOR_PATTERN) });
  }

  const owner = await verifyOwner(author, request.headers.get("x-owner-token") ?? "");
  if (!owner.ok) return json(owner.status, { error: owner.error });

  const knownStyle = STYLE_TOKENS.some((s) => s.id === style) ? style : "plain";
  await saveAuthorProfile(author, { name, style: knownStyle });

  return json(200, { ok: true, corner: `/#${author}` });
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}
