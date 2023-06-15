import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    email?: string;
    accessToken?: string | unknown;
    idToken?: string | unknown;
    user: {
      /** The user's postal address. */
      // accessToken: strng;
    } & DefaultSession["user"];
  }

  interface User {
    id: string & DefaultUser;
  }
}
