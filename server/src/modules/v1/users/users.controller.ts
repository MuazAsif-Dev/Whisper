import { FastifyReply, FastifyRequest } from "fastify";

import {
	createUserRequestBodyType,
	getUserByIdRequestParamsType,
} from "./users.schema";
import { createUser, getUserById, getUsers } from "./users.service";

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

	const { password, ...rest } = user;

	const safeUser = {
		...rest,
	};

	return safeUser;
}
