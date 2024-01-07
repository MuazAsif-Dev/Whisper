import { FastifyReply, FastifyRequest } from "fastify";
import {
	createRoomRequestBodyType,
	getRoomByIdRequestParamsType,
} from "./rooms.schema";
import { createRoom, getRoomById, getRooms } from "./rooms.service";
import { getUserById } from "../users/users.service";
import { createRoomMember } from "../roomMembers/roomMembers.service";

export async function createRoomHandler(
	req: FastifyRequest<{ Body: createRoomRequestBodyType }>,
	res: FastifyReply,
) {
	const roomData = req.body;

	const user = await getUserById(roomData.createdByUserId);

	if (!user) {
		res.code(404);
		return { message: "Invalid User Id" };
	}

	const room = await createRoom(roomData);

	if (!room) {
		res.code(404);
		return { message: "Room creation unsuccessful" };
	}

	const roomMember = await createRoomMember({
		roomId: room.id,
		userId: user.id,
	});

	if (!roomMember) {
		res.code(404);
		return { message: "Initial Room Member creation unsuccessful" };
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
