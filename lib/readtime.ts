// Reading time, derived from the doc itself at publish time. Visible prose
// only: scripts, styles, and the embedded doc-markdown block don't reach a
// reader's eyes, so they don't count.

const WORDS_PER_MINUTE = 220;

export function measureRead(html: string): { wordCount: number; readMinutes: number } {
  const visible = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ");
  const wordCount = visible.split(/\s+/).filter(Boolean).length;
  const readMinutes = wordCount === 0 ? 0 : Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
  return { wordCount, readMinutes };
}
