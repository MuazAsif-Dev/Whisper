import * as argon2 from "argon2";
import { FastifyReply, FastifyRequest } from "fastify";

import { SYSTEM_ROLES } from "@/config/data/permissions";

import {
	createUserRequestBodyType,
	loginUserRequestBodyType,
} from "./users.schema";
import { createUser } from "./users.service";

export async function createUserHandler(
	req: FastifyRequest<{ Body: createUserRequestBodyType }>,
	res: FastifyReply,
) {
	const { initalUser, ...data } = req.body;

	const roleType = initalUser
		? SYSTEM_ROLES.SUPER_ADMIN
		: SYSTEM_ROLES.APPLICATION_USER;

	if (roleType === SYSTEM_ROLES.SUPER_ADMIN) {
	}

	const user = await createUser(data);

	if (!user) {
		res.code(404);
		return { message: "User creation unsuccessful" };
	}

	return user;
}

export async function loginHandler(
	req: FastifyRequest<{
		Body: loginUserRequestBodyType;
	}>,
	res: FastifyReply,
) {
	const { email, password } = req.body;

	// const user = await getUserByEmail({
	// 	email,
	// });

	// if (!user || !(await argon2.verify(user.password, password))) {
	// 	res.code(400);
	// 	return {
	// 		message: "Invalid email or password",
	// 	};
	// }

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
