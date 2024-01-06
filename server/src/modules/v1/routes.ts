import type { FastifyInstance } from "fastify";

import userRouter from "./users/users.route";

export default async function router(router: FastifyInstance) {
	router.get("/", async () => {
		return { message: "Api v1 is running" };
	});

	router.register(userRouter, { prefix: "/users" });
}
