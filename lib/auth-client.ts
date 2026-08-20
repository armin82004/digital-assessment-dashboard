import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
export const authClient = createAuthClient({
  baseURL: "https://digital-assessment-dashboard-gcjx.vercel.app",
  plugins: [inferAdditionalFields<typeof auth>()],
});
