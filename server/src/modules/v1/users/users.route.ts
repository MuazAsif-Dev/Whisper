import type { FastifyInstance } from "fastify";

import {
	createUserHandler,
	getUserByIdHandler,
	getUsersByRoleHandler,
	getUsersHandler,
} from "./users.controller";
import {
	createUserJsonSchema,
	getUserByIdJsonSchema,
	getUsersByRoleJsonSchema,
} from "./users.schema";

export default async function userRouter(router: FastifyInstance) {
	router.get("/", getUsersHandler);

	router.get(
		"/role/:role",
		{ schema: getUsersByRoleJsonSchema },
		getUsersByRoleHandler,
	);

	router.get("/:id", { schema: getUserByIdJsonSchema }, getUserByIdHandler);

	router.post("/create", { schema: createUserJsonSchema }, createUserHandler);
}
