import { createAuthClient } from "better-auth/react";

// Browser-side auth client. No baseURL needed: the auth API is on the same origin (/api/auth).
export const authClient = createAuthClient();
