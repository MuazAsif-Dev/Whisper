import { Socket } from "socket.io-client";

type SocketContextType = {
	socket: Socket | null;
	messages: Map<string, Array<any>> | null;
	setMessages: React.Dispatch<
		React.SetStateAction<Map<string, Array<any>>>
	> | null;
	setRoomId: React.Dispatch<React.SetStateAction<string | null>>;
	isConnected: boolean;
};

export type { SocketContextType };
