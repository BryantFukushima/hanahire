import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/server/session";

import { SignInButtons } from "./sign-in-buttons";

const ERROR_MESSAGES: Record<string, string> = {
  EMAIL_NOT_ALLOWED:
    "That email isn't on the HanaHire invite list yet. Try another account.",
};

export default function SignInPage({ searchParams }: PageProps<"/sign-in">) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="text-3xl font-semibold tracking-tight">
        Sign in to HanaHire
      </h1>
      {/* Reads the session and query string at request time, so it streams in after the shell. */}
      <Suspense fallback={null}>
        <SignInStatus searchParams={searchParams} />
      </Suspense>
      <SignInButtons />
    </main>
  );
}

async function SignInStatus({
  searchParams,
}: Pick<PageProps<"/sign-in">, "searchParams">) {
  if (await getSession()) {
    redirect("/dashboard");
  }

  // Better Auth redirects back here with ?error=<code> when sign-in fails.
  const { error } = await searchParams;
  const code = (Array.isArray(error) ? error[0] : error)?.toUpperCase();
  if (!code) {
    return null;
  }
  return (
    <p role="alert" className="text-sm text-red-600 dark:text-red-400">
      {ERROR_MESSAGES[code] ?? "Sign-in didn't work. Please try again."}
    </p>
  );
}
