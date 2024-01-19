import { FastifyReply, FastifyRequest } from "fastify";
import {
	createRoomRequestBodyType,
	getRoomByIdRequestParamsType,
} from "./rooms.schema";
import {
	createRoomWithRoomMembers,
	getRoomById,
	getRooms,
} from "./rooms.service";

export async function createRoomHandler(
	req: FastifyRequest<{ Body: createRoomRequestBodyType }>,
	res: FastifyReply,
) {
	const roomData = req.body;

	const room = await createRoomWithRoomMembers(roomData);

	if (!room) {
		res.code(404);
		return { message: "Room creation unsuccessful" };
	}

	return room;
}

export async function getRoomsHandler() {
	const rooms = await getRooms();

	return rooms;
}

export async function getRoomByIdHandler(
	req: FastifyRequest<{
		Params: getRoomByIdRequestParamsType;
	}>,
	res: FastifyReply,
) {
	const { id } = req.params;

	const room = await getRoomById(id);

	if (!room) {
		res.code(404);
		return {
			message: "Invalid Room ID",
		};
	}

	return room;
}
