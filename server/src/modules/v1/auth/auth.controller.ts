import * as argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";
import {
	loginUserRequestBodyType,
	registerUserRequestBodyType,
} from "./auth.schema";
import { createUser, getUserByUsername } from "../users/users.service";

export async function loginHandler(
	req: FastifyRequest<{
		Body: loginUserRequestBodyType;
	}>,
	res: FastifyReply,
) {
	const { username, password } = req.body;

	const user = await getUserByUsername(username);

	if (!user || !(await argon2.verify(user.password, password))) {
		res.code(400);
		return {
			message: "Invalid username or password",
		};
	}

	const token = await res.jwtSign(
		{
			id: user.id,
			username: user.username,
		},
		{
			sign: {
				expiresIn: 24 * 60 * 60,
			},
		},
	);

	const { password: userPassword, ...rest } = user;

	const safeUser = {
		...rest,
	};

	return { user: safeUser, token };
}

export async function registerHandler(
	req: FastifyRequest<{
		Body: registerUserRequestBodyType;
	}>,
	res: FastifyReply,
) {
	const { username, password } = req.body;

	const user = await getUserByUsername(username);

	if (user) {
		res.code(400);
		return {
			message: "Username already exists",
		};
	}

	const newUser = await createUser({ username, password });

	if (!newUser) {
		res.code(404);
		return { message: "User creation unsuccessful" };
	}

	const token = await res.jwtSign(
		{
			id: newUser.id,
			username: newUser.username,
		},
		{
			sign: {
				expiresIn: 24 * 60 * 60,
			},
		},
	);

	return { newUser, token };
}
