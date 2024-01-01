import { z } from "zod";

const clientEnvSchema = z.object({
	SOCKET_URL: z.string().url(),
	API_BASE_URL: z.string().url(),
});

const env = {
	SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
	API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
};

export const envClient = clientEnvSchema.parse(env);
