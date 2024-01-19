import { InferInsertModel, eq } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { rooms } from "@/db/models/rooms.model";
import { roomMembers } from "@/db/models/roomMembers.model";

export async function createRoom(data: InferInsertModel<typeof rooms>) {
	const result = await db.insert(rooms).values(data).returning();

	return result[0];
}

export async function createRoomWithRoomMembers(
	data: InferInsertModel<typeof rooms> & {
		roomMembers: string[];
	},
) {
	const { roomMembers: roomMembersData, ...roomData } = data;

	const result = await db.transaction(async (tx) => {
		const roomResult = await tx.insert(rooms).values(roomData).returning();

		const roomResultObj = roomResult[0];

		if (!roomResultObj) {
			await tx.rollback();
			return;
		}
		const roomMembersWithRoomId = roomMembersData.map((member) => ({
			userId: member,
			roomId: roomResultObj.id,
		}));

		const roomMemberResult = await tx
			.insert(roomMembers)
			.values(roomMembersWithRoomId)
			.returning();

		return { room: roomResultObj, roomMembers: roomMemberResult };
	});

	return result;
}

export async function getRooms() {
	const result = await db.select().from(rooms);

	return result;
}

export async function getRoomById(roomId: string) {
	const result = await db.select().from(rooms).where(eq(rooms.id, roomId));

	return result[0];
}
