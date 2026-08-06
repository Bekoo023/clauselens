import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/normalize-email";
import { isSessionVersionStale } from "@/lib/session-version";
import { z } from "zod";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(8),
});

// How often an already-issued JWT is re-checked against the DB's
// sessionVersion. Keeps a stolen/old session from staying valid indefinitely
// after a password reset, without hitting the DB on every single request.
const SESSION_VERSION_RECHECK_MS = 5 * 60 * 1000;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Google,
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) return null;
        const email = normalizeEmail(parsed.data.email);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Google verifies the email address as part of its own sign-in flow -
      // the Auth.js adapter creates OAuth users with emailVerified: null
      // regardless, so we stamp it ourselves to trust the provider's
      // verification instead of requiring our own email-link flow for them.
      if (account?.provider === "google" && user.id) {
        await prisma.user.updateMany({
          where: { id: user.id, emailVerified: null },
          data: { emailVerified: new Date() },
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.sessionVersion = user.sessionVersion ?? 0;
        token.sessionVersionCheckedAt = Date.now();
        delete token.invalid;
        return token;
      }

      // `auth()` also runs inside middleware, which executes on the Edge
      // runtime: and the standard Prisma Client cannot run a query there
      // (it throws PrismaClientValidationError, which previously took down
      // every request once the recheck window elapsed). Skip the DB recheck
      // there; every actual page/API route still calls `auth()` again in the
      // Node.js runtime right after middleware passes the request through,
      // so the recheck still happens: just one hop later, not in Edge.
      const isEdgeRuntime = process.env.NEXT_RUNTIME === "edge";
      const checkedAt = token.sessionVersionCheckedAt ?? 0;
      if (!isEdgeRuntime && token.id && Date.now() - checkedAt > SESSION_VERSION_RECHECK_MS) {
        const current = await prisma.user.findUnique({
          where: { id: token.id },
          select: { sessionVersion: true },
        });
        if (isSessionVersionStale(current?.sessionVersion, token.sessionVersion ?? 0)) {
          token.invalid = true;
        } else {
          token.sessionVersionCheckedAt = Date.now();
        }
      }
      return token;
    },
    session({ session, token }) {
      // Leaving session.user.id unset for an invalidated token makes every
      // existing `session?.user?.id` check in the app treat it as logged out.
      if (!token.invalid && token.id && session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
});
