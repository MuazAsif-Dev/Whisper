import type { FastifyInstance } from "fastify";

import { createUserHandler, loginHandler } from "./users.controller";
import { createUserJsonSchema, loginUserJsonSchema } from "./users.schema";

export default async function userRouter(router: FastifyInstance) {
	router.post("/", { schema: createUserJsonSchema }, createUserHandler);

	router.post("/login", { schema: loginUserJsonSchema }, loginHandler);

	router.get("/", () => {
		return "User Routes";
	});
}
