import { FastifyReply, FastifyRequest } from "fastify";
import {
	createRoomMemberRequestBodyType,
	getRoomMembersByRoomIdRequestParamsType,
	getRoomMembersByUserIdRequestParamsType,
} from "./roomMembers.schema";
import {
	createRoomMember,
	getRoomMembers,
	getRoomsByUserId,
	getUsersByRoomId,
} from "./roomMembers.service";

export async function createRoomMemberHandler(
	req: FastifyRequest<{ Body: createRoomMemberRequestBodyType }>,
	res: FastifyReply,
) {
	const roomMemberData = req.body;

	const roomMember = await createRoomMember(roomMemberData);

	if (!roomMember) {
		res.code(404);
		return { message: "Room Member creation unsuccessful" };
	}

	return roomMember;
}

export async function getRoomMembersHandler() {
	const roomMembers = await getRoomMembers();

	return roomMembers;
}

export async function getRoomsByUserIdHandler(
	req: FastifyRequest<{
		Params: getRoomMembersByUserIdRequestParamsType;
	}>,
	res: FastifyReply,
) {
	const { userId } = req.params;

	const userRooms = await getRoomsByUserId(userId);

	if (!userRooms) {
		res.code(404);
		return {
			message: "Rooms for the provided User ID do not exist.",
		};
	}

	return userRooms;
}

export async function getUsersByRoomIdHandler(
	req: FastifyRequest<{
		Params: getRoomMembersByRoomIdRequestParamsType;
	}>,
	res: FastifyReply,
) {
	const { roomId } = req.params;

	const roomUsers = await getUsersByRoomId(roomId);

	if (!roomUsers) {
		res.code(404);
		return {
			message: "No users for the provided Room ID exist.",
		};
	}

	return roomUsers;
}
