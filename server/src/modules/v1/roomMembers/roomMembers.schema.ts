import { roomMembers } from "@/db/models/roomMembers.model";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// RoomMember <Insert> Schema
const createRoomMemberTableSchema = createInsertSchema(roomMembers);

const createRoomMemberApiValidatorSchema = createRoomMemberTableSchema.pick({
	roomId: true,
	userId: true,
});

export type createRoomMemberRequestBodyType = z.infer<
	typeof createRoomMemberApiValidatorSchema
>;

export const createRoomMemberJsonSchema = {
	body: zodToJsonSchema(
		createRoomMemberApiValidatorSchema,
		"createRoomMemberApiValidatorSchema",
	),
};

// RoomMember <Select> Schema
const selectRoomTableSchema = createSelectSchema(roomMembers);

const getRoomMembersByRoomIdApiValidatorSchema = selectRoomTableSchema.pick({
	roomId: true,
});

export type getRoomMembersByRoomIdRequestParamsType = z.infer<
	typeof getRoomMembersByRoomIdApiValidatorSchema
>;

export const getRoomMembersByRoomIdJsonSchema = {
	params: zodToJsonSchema(
		getRoomMembersByRoomIdApiValidatorSchema,
		"getRoomMembersByRoomIdApiValidatorSchema",
	),
};
const getRoomMembersByUserIdApiValidatorSchema = selectRoomTableSchema.pick({
	userId: true,
});

export type getRoomMembersByUserIdRequestParamsType = z.infer<
	typeof getRoomMembersByUserIdApiValidatorSchema
>;

export const getRoomMembersByUserIdJsonSchema = {
	params: zodToJsonSchema(
		getRoomMembersByUserIdApiValidatorSchema,
		"getRoomMembersByUserIdApiValidatorSchema",
	),
};
