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

interface IOEvents {
	"chat:connection-count-updated": (payload: any) => Promise<void>;
	"chat:new-message": (payload: any) => Promise<void>;
}

declare module "fastify" {
	interface FastifyInstance {
		io: Server<IOEvents>;
	}
}

interface CustomSocket extends Socket {
	username?: string;
}

let connectedClients = 0;

const CONNECTION_COUNT_KEY = "chat:connection-count";
const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
const NEW_MESSAGE_CHANNEL = "chat:new-message";

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

	const publisher = new Redis(env.UPSTASH_REDIS_URI);
	const subscriber = new Redis(env.UPSTASH_REDIS_URI);

	const currCount = await publisher.get(CONNECTION_COUNT_KEY);

	if (!currCount) {
		await publisher.set(CONNECTION_COUNT_KEY, 0);
	}

	app.get("/healthcheck", () => {
		return {
			status: "ok",
			port: env.PORT,
		};
	});

	app.io.use((socket: CustomSocket, next) => {
		const username = socket.handshake.auth.username;
		if (!username) {
			return next(new Error("invalid username"));
		}
		socket.username = username;
		console.log(username);
		next();
	});

	app.io.on("connection", async (io) => {
		app.log.debug("Client connected");

		const incResult = await publisher.incr(CONNECTION_COUNT_KEY);

		connectedClients++;

		await publisher.publish(
			CONNECTION_COUNT_UPDATED_CHANNEL,
			String(incResult),
		);

		io.on(NEW_MESSAGE_CHANNEL, async (payload) => {
			const message = payload.message;

			app.log.debug(`message from client : ${message}`);

			if (!message) return;

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

	app.register(router, { prefix: "/api/v1" });

	return app;
}
