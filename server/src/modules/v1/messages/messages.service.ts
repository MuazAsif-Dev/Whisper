import { InferInsertModel, desc, eq } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { messages } from "@/db/models/messages.model";

export async function createMessage(data: InferInsertModel<typeof messages>) {
	const result = await db.insert(messages).values(data).returning();

	return result[0];
}

export async function getMessages() {
	const result = await db.select().from(messages);

	return result;
}

export async function getMessageById(messageId: string) {
	const result = await db
		.select()
		.from(messages)
		.where(eq(messages.id, messageId));

	return result[0];
}

export async function getMessagesByRoomId(roomId: string) {
	const result = await db
		.select()
		.from(messages)
		.where(eq(messages.roomId, roomId))
		.orderBy(desc(messages.createdAt));

	return result;
}
