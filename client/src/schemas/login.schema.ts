import { z } from "zod";

const AnonymousUserLoginSchema = z.object({
	username: z.string().min(3),
	password: z
		.string()
		.min(6, "Password Length must be greater than 6 characters"),
});

const AnonymousUserLoginApiSchema = z.object({
	user: z.object({
        id: z.string().uuid(),
        username: z.string(),
        email: z.string().email().nullable(),
        isManagement: z.boolean(),
        isDeleted: z.boolean(),
        createdAt: z.string(),
        updatedAt: z.string()
    }),
    token: z.string()
});


export const UserLoginSchema = {
	AnonymousUserLoginSchema,
	AnonymousUserLoginApiSchema
}
