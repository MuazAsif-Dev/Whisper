import * as argon2 from "argon2";
import { InferInsertModel, eq, getTableColumns } from "drizzle-orm";

import { db } from "@/db/dbConnection";
import { users } from "@/db/models/users.model";

export async function createUser(data: InferInsertModel<typeof users>) {
	const hashedPassword = await argon2.hash(data.password);

	const { password, ...rest } = getTableColumns(users);

	const result = await db
		.insert(users)
		.values({
			...data,
			password: hashedPassword,
		})
		.returning({
			...rest,
		});

	return result[0];
}

export async function getUsers() {
	const { password, ...rest } = getTableColumns(users);

	const result = await db
		.select({
			...rest,
		})
		.from(users);

	return result;
}

function getUserQuery() {
	const query = db.select().from(users);

	return query.$dynamic();
}

export async function getUserById(userId: string) {
	const qb = getUserQuery();

	const result = await qb.where(eq(users.id, userId));

	return result[0];
}

export async function getUserByUsername(username: string) {
	const qb = getUserQuery();

	const result = await qb.where(eq(users.username, username));

	return result[0];
}

export async function getUserByEmail(email: string) {
	const qb = getUserQuery();

	const result = await qb.where(eq(users.email, email));

	return result[0];
}
