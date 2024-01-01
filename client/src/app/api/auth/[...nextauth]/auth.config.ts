import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { envServer } from "@/config/env.server";
import { UserLoginSchema } from "@/schemas/login.schema";

type userAuthToken = {
	id: string;
	name: string;
	phone: string;
	access_token: string;
};

export const authOptions: AuthOptions = {
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},
			async authorize(credentials) {
				if (credentials) return { id: "1", name: "test" };

				// const validatedCredentials = UserLoginSchema.safeParse(credentials);

				// if (validatedCredentials.success) {
				// 	const { password } = validatedCredentials.data;
				// 	const res: unknown = await getUser({ phone, password });

				// 	const validatedUser = UserLoginApiSchema.safeParse(res);

				// 	if (!validatedUser.success) {
				// 		return null;
				// 	}

				// 	const { user, access_token } = validatedUser.data;

				// 	return {
				// 		id: user.id,
				// 		name: user.name,
				// 		phone: user.phone,
				// 		access_token: access_token,
				// 	} as any as userAuthToken;
				// }

				return null;
			},
		}),
	],
	// callbacks: {
	// 	jwt({ token, user }) {
	// 		if (user) {
	// 			token.id = user.id;
	// 			token.access_token = user.access_token;
	// 		}
	// 		return token;
	// 	},
	// 	session({ session, token }) {
	// 		if (token) {
	// 			session.user.access_token = token.access_token;
	// 			session.user.id = token.id;
	// 			session.user.name = token.name;
	// 		}
	// 		return session;
	// 	},
	// },
	session: {
		strategy: "jwt",
	},
	secret: envServer.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};
