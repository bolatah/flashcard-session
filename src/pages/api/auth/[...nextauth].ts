import NextAuth, { NextAuthOptions } from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoDBConnect from "@/config/database"; // Assuming you have a MongoDB connection utility
import { Provider } from "next-auth/providers";
import dotenv from "dotenv";
import GoogleProvider from "next-auth/providers/google";
import { Types } from "mongoose";

dotenv.config();

const cookies = {
  sessionToken: {
    name: "next-auth.session-token",
    options: {
      httpOnly: true,
      secure: true, // Set the secure flag
      sameSite: "lax",
      path: "/",
    },
    callbackUrl: {
      name: "next-auth.callback-url",
      options: {
        httpOnly: true,
        secure: true, // Set the secure flag
        sameSite: "lax",
        path: "/",
      },
    },
    csrfToken: {
      name: "next-auth.csrf-token",
      options: {
        httpOnly: true,
        secure: true, // Set the secure flag
        sameSite: "lax",
        path: "/",
      },
    },
  },
};

export const options: NextAuthOptions = {
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: {
    strategy: "database",
  },
  cookies: cookies,
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_ID ?? "",
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET ?? "",
    }),
  ] as unknown as Provider[],

  adapter: MongoDBAdapter(mongoDBConnect),

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token as string;
        token.idToken = account.id_token as string;
      }

      return token;
    },
    async session({ session, user }) {
      console.log("session callback invoked");
      const client = await mongoDBConnect;

      const userObjectId = new Types.ObjectId(user.id);
      const userAccount = await client
        .db()
        .collection("accounts")
        .findOne({ userId: userObjectId });
      if (userAccount) {
        session.accessToken = userAccount.access_token;
        session.idToken = userAccount.id_token;
      }
      return session;
    },
  },
};
export default NextAuth(options);
