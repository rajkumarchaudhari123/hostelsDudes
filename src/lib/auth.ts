import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import type { UserRole } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const emailStr = (credentials.email as string).trim();
        const passStr = (credentials.password as string).trim();
        console.log("NextAuth authorize received credentials:", { emailStr, passStr });

        // Demo accounts fallback (bypasses database requirements for instant zero-config presentation)
        if ((emailStr === "admin@staynest.in" || emailStr === "admin@hostelsdudes.in") && (passStr === "Admin@123" || passStr === "Hostel@123")) {
          return { id: "demo-admin", name: "Super Admin", email: "admin@hostelsdudes.in", role: "SUPER_ADMIN" };
        }
        if ((emailStr === "owner@staynest.in" || emailStr === "owner@hostelsdudes.in") && (passStr === "Owner@123" || passStr === "Hostel@123")) {
          return { id: "demo-owner", name: "Sunita Khanna", email: "owner@hostelsdudes.in", role: "PG_OWNER" };
        }
        if ((emailStr === "student@staynest.in" || emailStr === "student@hostelsdudes.in") && (passStr === "Student@123" || passStr === "Hostel@123")) {
          return { id: "demo-student", name: "Anjali Sharma", email: "student@hostelsdudes.in", role: "STUDENT" };
        }

        // Custom Owner accounts fallback from local JSON storage
        try {
          const { getCustomOwners } = await import("@/utils/storage");
          const customOwners = getCustomOwners();
          const matched = customOwners.find(
            (o) =>
              (o.email.toLowerCase() === emailStr.toLowerCase() || o.adminId.toLowerCase() === emailStr.toLowerCase()) &&
              o.password === passStr
          );
          if (matched) {
            console.log("Custom owner authenticated from JSON:", matched);
            return {
              id: matched.id,
              name: matched.name,
              email: matched.email,
              role: "PG_OWNER",
            };
          }
        } catch (storageError) {
          console.error("Failed to read custom owners during authorize:", storageError);
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: emailStr },
          });

          if (!user || !user.password) return null;

          if (user.status !== "ACTIVE") {
            throw new Error("Account suspended. Contact support.");
          }

          const isValid = await bcrypt.compare(
            passStr,
            user.password
          );
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("Database auth failed, proceeding with fallback check:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
