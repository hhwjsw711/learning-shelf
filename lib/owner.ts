// Owner-token verification shared by every write route (publish, delete,
// avatar). The rule: an author's corner belongs to whoever holds the raw
// owner token minted with their kit. Tokens are stored only as sha256 hashes.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { claimAuthor, getAuthorRecord } from "./store";

export function mintOwnerToken(): string {
  return randomBytes(16).toString("hex");
}

export function hashOwnerToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// Check the raw token from a request against the author's stored hash.
// Unclaimed authors (records predating ownership, e.g. the first corners)
// are claimed by the first valid-secret caller — the shelf secret already
// gates all of these routes, so this is a group-members-only bootstrap.
export async function verifyOwner(
  author: string,
  rawToken: string,
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  if (!rawToken) {
    return {
      ok: false,
      status: 401,
      error:
        "missing x-owner-token header — your kit includes your personal owner token; re-mint it on /invite if you've lost it",
    };
  }

  const record = await getAuthorRecord(author);
  if (!record) {
    await claimAuthor(author, hashOwnerToken(rawToken));
    return { ok: true };
  }

  const given = Buffer.from(hashOwnerToken(rawToken));
  const stored = Buffer.from(record.tokenHash);
  if (given.length !== stored.length || !timingSafeEqual(given, stored)) {
    return {
      ok: false,
      status: 403,
      error: `wrong owner token for "${author}" — this corner belongs to someone else and only they can change it`,
    };
  }
  return { ok: true };
}
