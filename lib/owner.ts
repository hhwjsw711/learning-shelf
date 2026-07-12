// Owner-token verification shared by every write route (publish, delete,
// avatar). The rule: an author's corner belongs to whoever holds the raw
// owner token minted with their kit. Tokens are stored only as sha256 hashes.

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { claimAuthor, getAuthorRecord } from "./store";

// The member cookie: set when a kit is minted (or via /api/session), so the
// browser that claimed a corner gets owner controls on the site. Value is
// "<author>.<raw token>", httpOnly — server routes read it, page JS never can.
export const OWNER_COOKIE = "shelf_owner";

export function parseOwnerCookie(
  request: Request,
): { author: string; token: string } | null {
  const header = request.headers.get("cookie") ?? "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${OWNER_COOKIE}=([^;]+)`));
  if (!match) return null;
  const value = decodeURIComponent(match[1]);
  const dot = value.indexOf(".");
  if (dot <= 0) return null;
  return { author: value.slice(0, dot), token: value.slice(dot + 1) };
}

export function ownerCookieHeader(author: string, token: string): string {
  return `${OWNER_COOKIE}=${encodeURIComponent(`${author}.${token}`)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure; HttpOnly`;
}

export function clearOwnerCookieHeader(): string {
  return `${OWNER_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax; Secure; HttpOnly`;
}

// Token for a given author from either the x-owner-token header or the
// member cookie (cookie only counts if it names the same author).
export function ownerTokenFrom(request: Request, author: string): string {
  const header = request.headers.get("x-owner-token");
  if (header) return header;
  const cookie = parseOwnerCookie(request);
  return cookie && cookie.author === author ? cookie.token : "";
}

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
