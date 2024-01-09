import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";
import IO from "fastify-socket.io";
import Redis from "ioredis";
import { Server, Socket } from "socket.io";

import { env } from "@/config/env";
import { loggerConfig } from "@/config/logger";
import router from "@/modules/v1/routes";
import { randomUUID } from "crypto";
import {
	createMessage,
	getMessagesByRoomId,
} from "./modules/v1/messages/messages.service";
import { getUsersByRoomId } from "./modules/v1/roomMembers/roomMembers.service";
import { createAdapter } from "@socket.io/redis-adapter";

type token = {
	id: string;
	username: string;
};

const CONNECTION_COUNT_KEY = "chat:connection-count";
const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
const NEW_MESSAGE_CHANNEL = "chat:new-message";
const ROOM_JOIN = "chat:room:join";
const ROOM_NEW_MESSAGE = "chat:room:new-message";
const CHAT_ROOM_CHANNEL = (roomId: string) => `chat:room:${roomId}` as const;
const CHAT_ROOM_MESSAGE = (roomId: string) =>
	`chat:room:${roomId}:messages` as const;
const CHAT_ROOM_NEW_MESSAGE = (roomId: string) =>
	`chat:room:${roomId}:new-message` as const;

interface ServerToClientEvents {
	"chat:connection-count-updated": (payload: any) => Promise<void>;
	"chat:new-message": (payload: any) => Promise<void>;
	[key: ReturnType<typeof CHAT_ROOM_NEW_MESSAGE>]: (
		payload: any,
	) => Promise<void>;
	[key: ReturnType<typeof CHAT_ROOM_MESSAGE>]: (payload: any) => Promise<void>;
}
// interface ServerToClientEvents {
//   noArg: () => void;
//   basicEmit: (a: number, b: string, c: Buffer) => void;
//   withAck: (d: string, callback: (e: number) => void) => void;
// }

interface ClientToServerEvents {
	hello: () => void;
}

interface InterServerEvents {
	ping: () => void;
}

interface SocketData {
	token: token;
}

declare module "fastify" {
	interface FastifyInstance {
		io: Server<
			ClientToServerEvents,
			ServerToClientEvents,
			InterServerEvents,
			SocketData
		>;
	}
}

interface CustomSocket extends Socket {
	token?: token;
}

let connectedClients = 0;

const publisher = new Redis(env.UPSTASH_REDIS_URI);
const subscriber = new Redis(env.UPSTASH_REDIS_URI);

export async function createServer() {
	const app = Fastify({
		logger: env.NODE_ENV ? loggerConfig[env.NODE_ENV] : true,
	});

	await app.register(cors, {
		origin: env.CORS_ORIGIN,
	});

	await app.register(IO);

	await app.register(helmet);
	await app.register(rateLimit, {
		max: 60,
		timeWindow: 60 * 1000,
	});

	await app.register(jwt, { secret: env.JWT_SECRET_KEY });

	app.register(router, { prefix: "/api/v1" });

	app.get("/healthcheck", () => {
		return {
			status: "ok",
			port: env.PORT,
		};
	});

	const currCount = await publisher.get(CONNECTION_COUNT_KEY);

	if (!currCount) {
		await publisher.set(CONNECTION_COUNT_KEY, 0);
	}

	app.io.adapter(createAdapter(publisher, subscriber));

	app.io.use((socket: CustomSocket, next) => {
		const token = socket.handshake.headers.token as string;

		if (!token) {
			return next(new Error("NOT AUTHORIZED"));
		}
		try {
			const decoded = app.jwt.verify(token);
			socket.token = decoded as token;
		} catch (err) {
			return next(new Error("NOT AUTHORIZED"));
		}
		next();
	});

	app.io.on("connection", async (io: CustomSocket) => {
		app.log.debug("Client connected");

		const incResult = await publisher.incr(CONNECTION_COUNT_KEY);

		connectedClients++;

		await publisher.publish(
			CONNECTION_COUNT_UPDATED_CHANNEL,
			String(incResult),
		);

		io.on(ROOM_JOIN, async ({ roomId }: { roomId: string }) => {
			if (!io.token || !roomId) return;

			const roomMembers = await getUsersByRoomId(roomId);

			const isCurrentUserRoomMember = roomMembers.find(
				(roomMember) => roomMember.id === io.token?.id,
			);

			if (!isCurrentUserRoomMember) return;

			const CHAT_ROOM = CHAT_ROOM_CHANNEL(roomId);

			io.join(CHAT_ROOM);

			const prevMessages = await getMessagesByRoomId(roomId);

			app.io.to(CHAT_ROOM).emit(CHAT_ROOM_MESSAGE(roomId), {
				messages: prevMessages,
			});
		});

		io.on(ROOM_NEW_MESSAGE, async ({ message, roomId }) => {
			if (!io.token || !message || !roomId) return;

			const roomMembers = await getUsersByRoomId(roomId);
			const isCurrentUserRoomMember = roomMembers.find(
				(roomMember) => roomMember.id === io.token?.id,
			);
			if (!isCurrentUserRoomMember) return;

			const newMessage = await createMessage({
				userId: io.token.id,
				roomId,
				content: message,
			});

			if (!newMessage) return;

			console.log({ newMessage, roomId });

			const CHAT_ROOM = CHAT_ROOM_CHANNEL(roomId);

			app.io.to(CHAT_ROOM).emit(CHAT_ROOM_NEW_MESSAGE(roomId), {
				message: newMessage,
			});
		});

		io.on(NEW_MESSAGE_CHANNEL, async (payload) => {
			const message = payload.message;
			const room = payload.roomId;

			app.log.debug(`message from client : ${message}, room: ${room}`);

			if (!message || !room) return;

			await publisher.publish(NEW_MESSAGE_CHANNEL, message.toString());
		});

		io.on("disconnect", async () => {
			app.log.debug("Client disconnected");

			connectedClients--;

			const decResult = await publisher.decr(CONNECTION_COUNT_KEY);

			await publisher.publish(
				CONNECTION_COUNT_UPDATED_CHANNEL,
				String(decResult),
			);
		});
	});

	subscriber.subscribe(CONNECTION_COUNT_UPDATED_CHANNEL, (err, count) => {
		if (err) {
			app.log.error(
				`Error subscribing to ${CONNECTION_COUNT_UPDATED_CHANNEL}`,
				err,
			);
			return;
		}

		app.log.debug(
			`${count} clients subscribed to ${CONNECTION_COUNT_UPDATED_CHANNEL} channel`,
		);
	});

	subscriber.subscribe(NEW_MESSAGE_CHANNEL, (err, count) => {
		if (err) {
			app.log.error(`Error subscribing to ${NEW_MESSAGE_CHANNEL}`, err);
			return;
		}

		app.log.debug(
			`${count} clients subscribed to ${NEW_MESSAGE_CHANNEL} channel`,
		);
	});

	subscriber.on("message", (channel, text) => {
		if (channel === CONNECTION_COUNT_UPDATED_CHANNEL) {
			app.io.emit(CONNECTION_COUNT_UPDATED_CHANNEL, {
				count: text,
			});
			return;
		}

		if (channel === NEW_MESSAGE_CHANNEL) {
			app.io.emit(NEW_MESSAGE_CHANNEL, {
				message: text,
				id: randomUUID(),
				createdAt: new Date(),
				port: env.PORT,
			});
			return;
		}
	});

	app.addHook("onClose", async () => {
		app.log.debug("Updating connection count");
		if (connectedClients > 0) {
			const currentCount = parseInt(
				(await publisher.get(CONNECTION_COUNT_KEY)) || "0",
				10,
			);

			const newCount = Math.max(currentCount - connectedClients, 0);
			console.log(currCount, newCount);

			await publisher.set(CONNECTION_COUNT_KEY, newCount);
		}
		return;
	});

	return app;
}
