"use client";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

type Provider = "google" | "github";

const PROVIDERS: { id: Provider; label: string }[] = [
  { id: "google", label: "Continue with Google" },
  { id: "github", label: "Continue with GitHub" },
];

export function SignInButtons() {
  const [pending, setPending] = useState<Provider | null>(null);

  async function signIn(provider: Provider) {
    setPending(provider);
    // On success the browser leaves for Google/GitHub, so pending only resets on failure.
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/dashboard",
      errorCallbackURL: "/sign-in",
    });
    if (error) {
      setPending(null);
    }
  }

  return (
    <div className="flex w-full max-w-xs flex-col gap-3">
      {PROVIDERS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => signIn(id)}
          disabled={pending !== null}
          className="rounded-md border border-foreground/20 px-4 py-2 font-medium transition hover:bg-foreground/5 disabled:opacity-50"
        >
          {pending === id ? "Redirecting…" : label}
        </button>
      ))}
    </div>
  );
}
