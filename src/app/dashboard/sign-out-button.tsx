"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    // Deletes the session row and clears the cookie, so the old token stops working immediately.
    await authClient.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
    >
      Sign out
    </button>
  );
}
