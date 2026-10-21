import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/server/auth";

// cache() dedupes calls within one request, so several components can ask for the session
// without repeating the database lookup.
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

// The real auth check for protected pages, server actions, and route handlers: validates the
// session against the database and returns the signed-in user, or redirects to /sign-in.
// Scope every data query to the returned user's id.
export async function requireUser() {
  const session = await getSession();
  if (!session) {
    redirect("/sign-in");
  }
  return session.user;
}
