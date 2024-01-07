import { InferInsertModel, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { roomMembers } from "@/db/models/roomMembers.model";
import { rooms } from "@/db/models/rooms.model";
import { users } from "@/db/models/users.model";

export async function createRoomMember(
	data: InferInsertModel<typeof roomMembers>,
) {
	const result = await db.insert(roomMembers).values(data).returning();

	return result[0];
}

export async function getRoomMembers() {
	const result = await db.select().from(roomMembers);

	return result;
}

export async function getRoomsByUserId(userId: string) {
	const { ...rest } = getTableColumns(rooms);

	const result = await db
		.select({ ...rest })
		.from(rooms)
		.leftJoin(roomMembers, eq(rooms.id, roomMembers.roomId))
		.where(eq(roomMembers.userId, userId));

	return result;
}

export async function getUsersByRoomId(roomId: string) {
	const { password, ...rest } = getTableColumns(users);

	const result = await db
		.select({ ...rest, roomId: roomMembers.roomId })
		.from(users)
		.leftJoin(roomMembers, eq(users.id, roomMembers.userId))
		.where(eq(roomMembers.roomId, roomId));

	return result;
}
