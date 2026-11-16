import { localAdminEnabled, localAdminEmail } from "./local-development";
import { getServerSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { createHash } from "node:crypto";
import { db } from "./db";
import { limit } from "./security";
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  pages: { signIn: "/admin/login" },
  providers: [
    Credentials({
      name: "Administrator",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(c, req) {
        if (
          !(await limit(
            "login-ip:" +
              (req.headers?.["x-forwarded-for"]?.split(",")[0] ?? "unknown"),
            30,
            900,
          ))
        )
          return null;
        if (!c?.email || !c?.password || c.password.length > 200) return null;
        const email = c.email.toLowerCase().trim();
        if (!(await limit("login:" + email, 10, 900))) return null;
        const admin = await db.admin.findUnique({ where: { email } });
        const valid = await compare(
          c.password,
          admin?.passwordHash ??
            "$2b$12$C6UzMDM.H6dfI/f/IKcEe.5JFaQ0YPkUR9p7WLCXXNqLDRCqvU0G6",
        );
        return admin && valid
          ? {
              id: admin.id,
              email: admin.email,
              name: admin.role,
              credentialVersion: credentialVersion(admin.passwordHash),
            }
          : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.name;
        token.credentialVersion = (
          user as { credentialVersion?: string }
        ).credentialVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = String(token.role);
      (
        session as typeof session & { credentialVersion?: string }
      ).credentialVersion = token.credentialVersion as string | undefined;
      return session;
    },
  },
};
function credentialVersion(passwordHash: string) {
  return createHash("sha256").update(passwordHash).digest("hex");
}

export async function sessionAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const admin = await db.admin.findUnique({
    where: { email: session.user.email },
  });
  const version = (session as typeof session & { credentialVersion?: string })
    .credentialVersion;
  return admin && version === credentialVersion(admin.passwordHash)
    ? admin
    : null;
}

export async function administrator(owner = false) {
  const user = localAdminEnabled()
    ? await db.admin.findUnique({ where: { email: localAdminEmail } })
    : await sessionAdmin();
  if (
    !user ||
    !["OWNER", "EDITOR"].includes(user.role) ||
    (owner && user.role !== "OWNER")
  )
    return null;
  return user;
}

export async function passwordChangeRequired() {
  if (localAdminEnabled()) return false;
  const admin = await sessionAdmin();
  return admin?.role === "OWNER_PASSWORD_RESET";
}
