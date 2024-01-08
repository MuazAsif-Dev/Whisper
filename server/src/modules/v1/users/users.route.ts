import type { FastifyInstance } from "fastify";

import {
	createUserHandler,
	getUserByIdHandler,
	getUsersHandler,
} from "./users.controller";
import { createUserJsonSchema, getUserByIdJsonSchema } from "./users.schema";

export default async function userRouter(router: FastifyInstance) {
	router.get("/", getUsersHandler);

	router.get("/:id", { schema: getUserByIdJsonSchema }, getUserByIdHandler);

	router.post("/create", { schema: createUserJsonSchema }, createUserHandler);
}
