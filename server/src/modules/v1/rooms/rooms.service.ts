import { InferInsertModel, eq } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { rooms } from "@/db/models/rooms.model";

export async function createRoom(data: InferInsertModel<typeof rooms>) {
	const result = await db.insert(rooms).values(data).returning();

	return result[0];
}

export async function getRooms() {
	const result = await db.select().from(rooms);

	return result;
}

export async function getRoomById(roomId: string) {
	const result = await db.select().from(rooms).where(eq(rooms.id, roomId));

	return result[0];
}
