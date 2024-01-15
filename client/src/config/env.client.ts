import { z } from "zod";

const clientEnvSchema = z.object({
	NEXT_PUBLIC_API_SOCKET_URL: z.string().url(),
	NEXT_PUBLIC_API_BASE_URL: z.string().url(),
	NEXT_PUBLIC_BACKEND_API_BASE_URL: z.string().url(),
});

const env = {
	NEXT_PUBLIC_API_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
	NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
	NEXT_PUBLIC_BACKEND_API_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL
};

export const envClient = clientEnvSchema.parse(env);
