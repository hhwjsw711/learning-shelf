// Serve a published doc verbatim as a full HTML document. A route handler
// rather than a page on purpose: the docs are self-contained HTML files with
// their own styles and scripts, and must reach the browser untouched — not
// embedded inside someone else's React tree.

import { getDocHtml } from "@/lib/store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await params;
  const html = await getDocHtml(slug);

  if (html === undefined) {
    return new Response("No doc on the shelf at this slug.", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      // Docs are republished on every edit; always serve the latest.
      "cache-control": "no-store",
    },
  });
}
