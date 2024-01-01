import * as argon2 from "argon2";
import { and, eq, InferInsertModel } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { users } from "@/db/models/users.model";

export async function createUser(data: InferInsertModel<typeof users>) {
	const hashedPassword = await argon2.hash(data.password);

	const result = await db
		.insert(users)
		.values({
			...data,
			password: hashedPassword,
		})
		.returning({
			id: users.id,
			email: users.email,
			name: users.name,
			createdAt: users.createdAt,
		});

	return result[0];
}
