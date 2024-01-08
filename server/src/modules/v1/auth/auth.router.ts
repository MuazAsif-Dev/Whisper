import type { FastifyInstance } from "fastify";

import { loginUserJsonSchema, registerUserJsonSchema } from "./auth.schema";
import { loginHandler, registerHandler } from "./auth.controller";

export default async function authRouter(router: FastifyInstance) {
	router.post("/login", { schema: loginUserJsonSchema }, loginHandler);

	router.post("/register", { schema: registerUserJsonSchema }, registerHandler);
}
