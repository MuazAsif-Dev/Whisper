import { users } from "@/db/models/users.model";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const selectUserTableSchema = createSelectSchema(users);

const loginUserApiValidatorSchema = selectUserTableSchema.pick({
	username: true,
	password: true,
});

export type loginUserRequestBodyType = z.infer<
	typeof loginUserApiValidatorSchema
>;

export const loginUserJsonSchema = {
	body: zodToJsonSchema(
		loginUserApiValidatorSchema,
		"loginUserApiValidatorSchema",
	),
};

const createUserTableSchema = createInsertSchema(users, {
	username: (schema) => schema.username.min(3),
	password: (schema) => schema.password.min(6),
});

const registerUserApiValidatorSchema = createUserTableSchema.pick({
	username: true,
	password: true,
});

export type registerUserRequestBodyType = z.infer<
	typeof registerUserApiValidatorSchema
>;

export const registerUserJsonSchema = {
	body: zodToJsonSchema(
		registerUserApiValidatorSchema,
		"registerUserApiValidatorSchema",
	),
};
