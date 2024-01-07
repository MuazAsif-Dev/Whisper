import type { FastifyInstance } from "fastify";
import {
	createRoomMemberHandler,
	getRoomMembersHandler,
	getRoomsByUserIdHandler,
	getUsersByRoomIdHandler,
} from "./roomMembers.controller";
import {
	createRoomMemberJsonSchema,
	getRoomMembersByRoomIdJsonSchema,
	getRoomMembersByUserIdJsonSchema,
} from "./roomMembers.schema";

export default async function roomMemberRouter(router: FastifyInstance) {
	router.get("/", getRoomMembersHandler);

	router.get(
		"/room/:roomId",
		{ schema: getRoomMembersByRoomIdJsonSchema },
		getUsersByRoomIdHandler,
	);

	router.get(
		"/user/:userId",
		{ schema: getRoomMembersByUserIdJsonSchema },
		getRoomsByUserIdHandler,
	);

	router.post(
		"/create",
		{ schema: createRoomMemberJsonSchema },
		createRoomMemberHandler,
	);
}
