import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { envServer } from "@/config/env.server";
import { UserLoginSchema } from "@/schemas/login.schema";
import ky from "ky";

type userAuthToken = {
	id: string;
	username: string;
	access_token: string;
};

const {AnonymousUserLoginSchema, AnonymousUserLoginApiSchema} = UserLoginSchema


async function loginUser(data: { username: string; password: string }) {
	try {
		const result = await ky.post(`${envServer.API_BASE_URL}/api/v1/auth/login`, {json: data}).json();

		const validatedResult = AnonymousUserLoginApiSchema.safeParse(result);

		if (!validatedResult.success) {
			throw new Error(JSON.stringify(validatedResult.error));
		}
		return result;
	} catch (err) {
		console.log((err as Error).message);

		return null;
	}
}


export const authOptions: AuthOptions = {
	pages: {
		signIn: "/login",
	},
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {},
			async authorize(credentials) {
				const validatedCredentials = AnonymousUserLoginSchema.safeParse(credentials);

				if (validatedCredentials.success) {
					const { username, password } = validatedCredentials.data;
					const res: unknown = await loginUser({ username, password });

					const validatedUser = AnonymousUserLoginApiSchema.safeParse(res);

					if (!validatedUser.success) {
						return null;
					}

					const { user, token } = validatedUser.data;

					return {
						id: user.id,
						username: user.username,
						access_token: token,
					} as any as userAuthToken;
				}

				return null;
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.access_token = user.access_token;
			}
			return token;
		},
		session({ session, token }) {
			if (token) {
				session.user.access_token = token.access_token;
				session.user.id = token.id;
				session.user.name = token.name;
			}
			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	secret: envServer.NEXTAUTH_SECRET,
	debug: process.env.NODE_ENV === "development",
};
