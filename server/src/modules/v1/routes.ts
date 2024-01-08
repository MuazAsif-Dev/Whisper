import type { FastifyInstance } from "fastify";

import userRouter from "./users/users.route";
import roomRouter from "./rooms/rooms.route";
import roomMemberRouter from "./roomMembers/roomMembers.route";
import authRouter from "./auth/auth.router";

async function publicRoutes(router: FastifyInstance) {
	router.register(authRouter, { prefix: "/auth" });
}

async function protectedRoutes(router: FastifyInstance) {
	router.addHook("onRequest", async (request, reply) => {
		try {
			await request.jwtVerify();
		} catch (err) {
			reply.send(err);
		}
	});

	router.register(userRouter, { prefix: "/users" });
	router.register(roomRouter, { prefix: "/rooms" });
	router.register(roomMemberRouter, { prefix: "/room-members" });
}

export default async function router(router: FastifyInstance) {
	router.get("/", async () => {
		return { message: "Api v1 is running" };
	});

	router.register(publicRoutes);
	router.register(protectedRoutes);
}
