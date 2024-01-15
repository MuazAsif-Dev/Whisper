import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface User {
		id: string;
		username: string;
		access_token: string;
	}
	interface Session {
		user: {
			id: string | null | undefined;
			username: string | null | undefined;
			access_token: string | null | undefined;
		} & DefaultSession["user"];
	}
}
declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		username: string;
		access_token: string;
	}
}
