import { envClient } from "@/config/env.client";
import { io } from "socket.io-client";

const socket = io(envClient.NEXT_PUBLIC_API_SOCKET_URL, {
	reconnection: true,
	upgrade: true,
	autoConnect: false,
	transports: ["websocket", "polling"],
});

export default socket;
