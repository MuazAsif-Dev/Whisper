import z from "zod";

const serverEnvSchema = z.object({
	API_BASE_URL: z.string(),
	NEXTAUTH_SECRET: z.string(),
});

const env = {
	API_BASE_URL: process.env.API_BASE_URL,
	NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};

export const envServer = serverEnvSchema.parse(env);
