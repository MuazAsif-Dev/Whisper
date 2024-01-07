import type { FastifyInstance } from "fastify";
import {
	createRoomHandler,
	getRoomByIdHandler,
	getRoomsHandler,
} from "./rooms.controller";
import { createRoomJsonSchema, getRoomByIdJsonSchema } from "./rooms.schema";

export default async function roomRouter(router: FastifyInstance) {
	router.get("/", getRoomsHandler);

	router.get("/:id", { schema: getRoomByIdJsonSchema }, getRoomByIdHandler);

	router.post("/create", { schema: createRoomJsonSchema }, createRoomHandler);
}
