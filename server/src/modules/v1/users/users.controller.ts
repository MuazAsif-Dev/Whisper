import * as argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";

import {
	createUserRequestBodyType,
	getUserByIdRequestParamsType,
	loginUserRequestBodyType,
	registerUserRequestBodyType,
} from "./users.schema";
import {
	createUser,
	getUserById,
	getUserByUsername,
	getUsers,
} from "./users.service";

export async function createUserHandler(
	req: FastifyRequest<{ Body: createUserRequestBodyType }>,
	res: FastifyReply,
) {
	const userData = req.body;

	const user = await createUser(userData);

	if (!user) {
		res.code(404);
		return { message: "User creation unsuccessful" };
	}

	return user;
}

export async function getUsersHandler() {
	const users = await getUsers();

	return users;
}

export async function getUserByIdHandler(
	req: FastifyRequest<{
		Params: getUserByIdRequestParamsType;
	}>,
	res: FastifyReply,
) {
	const { id } = req.params;

	const user = await getUserById(id);

	if (!user) {
		res.code(404);
		return {
			message: "Invalid User ID",
		};
	}

	return user;
}

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

	// const token = await res.jwtSign(
	// 	{
	// 		id: user.id,
	// 		email,
	// 		applicationId,
	// 		scopes: user.permissions,
	// 	},
	// 	{
	// 		sign: {
	// 			expiresIn: "5m",
	// 		},
	// 	},
	// );

	// return { token };
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

	// const token = await res.jwtSign(
	// 	{
	// 		id: user.id,
	// 		scopes: user.permissions,
	// 	},
	// 	{
	// 		sign: {
	// 			expiresIn: "5m",
	// 		},
	// 	},
	// );

	// return { token };

	return user;
}
