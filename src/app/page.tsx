import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        HanaHire
      </h1>
      <p className="text-lg text-foreground/70">
        We draft. You decide. You get hired.
      </p>
      <p className="text-sm text-foreground/50">
        In early development. Check back soon.
      </p>
      <Link
        href="/sign-in"
        className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium transition hover:bg-foreground/5"
      >
        Sign in
      </Link>
    </main>
  );
}
