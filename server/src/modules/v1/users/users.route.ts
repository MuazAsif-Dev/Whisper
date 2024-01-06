import type { FastifyInstance } from "fastify";

import {
	createUserHandler,
	getUserByIdHandler,
	loginHandler,
} from "./users.controller";
import {
	createUserJsonSchema,
	getUserByIdJsonSchema,
	loginUserJsonSchema,
	registerUserJsonSchema,
} from "./users.schema";

export default async function userRouter(router: FastifyInstance) {
	router.get("/", () => {
		return "User Routes";
	});

	router.post("/create", { schema: createUserJsonSchema }, createUserHandler);

	router.post(
		"/:userId",
		{ schema: getUserByIdJsonSchema },
		getUserByIdHandler,
	);

	router.post("/login", { schema: loginUserJsonSchema }, loginHandler);

	router.post("/register", { schema: registerUserJsonSchema }, loginHandler);
}
