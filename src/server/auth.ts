import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";

import { env } from "@/env";
import { isEmailAllowed } from "@/lib/allowlist";
import { db } from "@/server/db";

const DAY_IN_SECONDS = 60 * 60 * 24;

// Thrown from database hooks. In the OAuth callback, Better Auth turns it into a redirect to
// the sign-in page's errorCallbackURL with ?error=EMAIL_NOT_ALLOWED.
function assertEmailAllowed(email: string) {
  if (!isEmailAllowed(email, env.ALLOWED_EMAILS)) {
    throw new APIError("FORBIDDEN", {
      code: "EMAIL_NOT_ALLOWED",
      message: "This email isn't on the HanaHire allowlist.",
    });
  }
}

export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  database: prismaAdapter(db, { provider: "postgresql" }),

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },

  session: {
    // Idle expiry: a session ends after 3 days without use. Activity extends it, at most once a day.
    expiresIn: 3 * DAY_IN_SECONDS,
    updateAge: DAY_IN_SECONDS,
  },

  account: {
    // Google/GitHub access and refresh tokens are encrypted with BETTER_AUTH_SECRET before storage.
    encryptOAuthTokens: true,
    // Signing in with Google and GitHub using the same email links both to one user.
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
  },

  databaseHooks: {
    // Allowlist checks run on the server for new users and for every new session, so removing
    // an email also blocks future sign-ins for an existing account.
    user: {
      create: {
        before: async (user) => {
          assertEmailAllowed(user.email);
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          const user = await db.user.findUnique({
            where: { id: session.userId },
            select: { email: true },
          });
          assertEmailAllowed(user?.email ?? "");
        },
      },
    },
    // encryptOAuthTokens doesn't cover the ID token. HanaHire never uses it after sign-in, so it
    // isn't stored at all.
    account: {
      create: {
        before: async (account) => ({ data: { ...account, idToken: null } }),
      },
      update: {
        before: async (account) => ({ data: { ...account, idToken: null } }),
      },
    },
  },

  // Must be the last plugin: lets server actions set auth cookies.
  plugins: [nextCookies()],
});
