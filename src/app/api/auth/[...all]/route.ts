import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/server/auth";

// Serves every /api/auth/* endpoint: social sign-in, OAuth callbacks, session, sign-out.
export const { GET, POST } = toNextJsHandler(auth);
