// Server shell for the join desk: reads the owner cookie so a browser that
// already claimed a corner sees its kit again instead of the mint form.

import { cookies } from "next/headers";
import { OWNER_COOKIE } from "@/lib/owner";
import { InviteClient } from "./InviteClient";

export const dynamic = "force-dynamic";

export default async function InvitePage() {
  const value = (await cookies()).get(OWNER_COOKIE)?.value ?? "";
  const viewer = value.includes(".") ? value.slice(0, value.indexOf(".")) : null;
  return <InviteClient viewer={viewer} />;
}
