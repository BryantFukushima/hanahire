// Pure logic (no server-only import) so it can be unit-tested. Enforcement happens in
// src/server/auth.ts, on the server.
export function isEmailAllowed(
  email: string,
  allowedEmails: readonly string[],
): boolean {
  return allowedEmails.includes(email.trim().toLowerCase());
}
