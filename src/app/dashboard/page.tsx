import { Suspense } from "react";

import { requireUser } from "@/server/session";

import { SignOutButton } from "./sign-out-button";

export default function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <Suspense fallback={<p className="text-foreground/50">Loading…</p>}>
        <Welcome />
      </Suspense>
    </main>
  );
}

async function Welcome() {
  // The real auth check: redirects to /sign-in unless the session is valid in the database.
  const user = await requireUser();

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">
        Welcome, {user.name || user.email}
      </h1>
      <p className="text-foreground/70">Signed in as {user.email}</p>
      <SignOutButton />
    </>
  );
}
