import { z } from "zod";

export const AnonymousUserSignUpSchema = z.object({
	username: z.string().min(3),
	password: z
		.string()
		.min(6, "Password Length must be greater than 6 characters"),
});
