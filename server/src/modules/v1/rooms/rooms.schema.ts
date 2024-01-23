import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { rooms } from "@/db/models/rooms.model";

// Room <Insert> Schema
const createRoomTableSchema = createInsertSchema(rooms, {
	title: (schema) => schema.title.min(3),
});

const createRoomApiValidatorSchema = createRoomTableSchema
	.pick({
		title: true,
	})
	.extend({
		roomMembers: z
			.array(z.string().uuid())
			.min(2, "Room must have at least 2 members"),
	});

export type createRoomRequestBodyType = z.infer<
	typeof createRoomApiValidatorSchema
>;

export const createRoomJsonSchema = {
	body: zodToJsonSchema(
		createRoomApiValidatorSchema,
		"createRoomApiValidatorSchema",
	),
};

// Room <Select> Schema
const selectRoomTableSchema = createSelectSchema(rooms);

const getRoomByIdApiValidatorSchema = selectRoomTableSchema.pick({
	id: true,
});

export type getRoomByIdRequestParamsType = z.infer<
	typeof getRoomByIdApiValidatorSchema
>;

export const getRoomByIdJsonSchema = {
	params: zodToJsonSchema(
		getRoomByIdApiValidatorSchema,
		"getRoomByIdApiValidatorSchema",
	),
};
