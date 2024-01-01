// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		name: string;
	}
	interface Session {
		user: {
			id: string | null | undefined;
			name: string | null | undefined;
		} & DefaultSession["user"];
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		name: string;
	}
}
