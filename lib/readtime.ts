// Reading time, derived from the doc itself at publish time. Visible prose
// only: scripts, styles, and the embedded doc-markdown block don't reach a
// reader's eyes, so they don't count.

const WORDS_PER_MINUTE = 220;

// The depth spectrum: how deep the learner has actually gone, judged by the
// prose that exists (measured, never self-reported). Thresholds are words of
// visible text. The journey metaphor is a dive — deeper as the doc grows.
export const DEPTH_LEVELS = [
  { emoji: "🏖️", label: "wading", minWords: 0 },
  { emoji: "🤿", label: "snorkeling", minWords: 2500 },
  { emoji: "🐠", label: "diving", minWords: 6000 },
  { emoji: "🐋", label: "deep water", minWords: 12000 },
  { emoji: "🦑", label: "the abyss", minWords: 20000 },
] as const;

export function depthIndex(wordCount: number): number {
  let level = 0;
  for (let i = 0; i < DEPTH_LEVELS.length; i++) {
    if (wordCount >= DEPTH_LEVELS[i].minWords) level = i;
  }
  return level;
}

// Where the dive is headed: written words scaled by module progress. A doc
// 2/7 through with 2,700 words is on course for ~9,400 — deep water.
export function projectedDepthIndex(
  wordCount: number,
  modulesDone: number,
  modulesTotal: number,
): number {
  if (!modulesTotal || !modulesDone || modulesDone >= modulesTotal) {
    return depthIndex(wordCount);
  }
  return depthIndex(Math.round(wordCount * (modulesTotal / modulesDone)));
}

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
