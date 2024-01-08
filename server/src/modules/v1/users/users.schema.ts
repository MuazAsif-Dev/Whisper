import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

import { users } from "@/db/models/users.model";

// Anonymous User <Insert> Schema
const createUserTableSchema = createInsertSchema(users, {
	username: (schema) => schema.username.min(3),
	password: (schema) => schema.password.min(6),
});

const createUserApiValidatorSchema = createUserTableSchema.pick({
	username: true,
	password: true,
});

export type createUserRequestBodyType = z.infer<
	typeof createUserApiValidatorSchema
>;

export const createUserJsonSchema = {
	body: zodToJsonSchema(
		createUserApiValidatorSchema,
		"createUserApiValidatorSchema",
	),
};

// User <Select> Schema
const selectUserTableSchema = createSelectSchema(users);

const getUserByIdApiValidatorSchema = selectUserTableSchema.pick({
	id: true,
});

export type getUserByIdRequestParamsType = z.infer<
	typeof getUserByIdApiValidatorSchema
>;

export const getUserByIdJsonSchema = {
	params: zodToJsonSchema(
		getUserByIdApiValidatorSchema,
		"getUserByIdApiValidatorSchema",
	),
};
