import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
  interface User {
    sessionVersion?: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    sessionVersion?: number;
    sessionVersionCheckedAt?: number;
    invalid?: boolean;
  }
}
