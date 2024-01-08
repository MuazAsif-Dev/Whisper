import { users } from "@/db/models/users.model";
import { createSelectSchema } from "drizzle-zod";
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

const registerUserApiValidatorSchema = selectUserTableSchema.pick({
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
