"use client";

import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

import socket from "@/lib/socket/socket";
import { SocketContextType } from "@/types/socket.type";
import socketEvents from "@/lib/socket/socketEvents";
import { sleep } from "@/utils/sleep";

type Message = {
	message: string;
	id: string;
	createdAt: string;
	port: string;
};

export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const session = useSession();
	const [isConnected, setIsConnected] = useState(false);
	const [roomId, setRoomId] = useState<string | null>(null);
	const [messages, setMessages] = useState<Map<string, Array<any>>>(new Map());

	function socketInit() {
		const token = session.data?.user.access_token;
		if (!socket.connected && token) {
			socket.auth = { token };
			socket.connect();
		}
	}

	function onConnect() {
		console.log("connected to socket", socket.id);
		sleep(() => setIsConnected(true));
	}

	function onDisconnect() {
		setIsConnected(false);
	}

	function onRoomMessage({
		room,
		messages,
	}: {
		room: string;
		messages: Message[];
	}) {
		if (!room) return;
		setMessages((map) => new Map(map.set(room, messages)));
	}

	function onRoomNewMessage({
		room,
		message,
	}: {
		room: string;
		message: Message;
	}) {
		if (!room) return;
		setMessages((map) => {
			const roomMessages = map.get(room) ?? [];
			return new Map(map.set(room, [...roomMessages, message]));
		});
	}

	useEffect(() => {
		socketInit();

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);
		socket.on(socketEvents.ROOM_MESSAGES, onRoomMessage);
		socket.on(socketEvents.ROOM_NEW_MESSAGE, onRoomNewMessage);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.off(socketEvents.ROOM_MESSAGES, onRoomMessage);
			socket.off(socketEvents.ROOM_NEW_MESSAGE, onRoomNewMessage);

			if (socket.connected) socket.disconnect();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SocketContext.Provider
			value={{ socket, messages, setMessages, setRoomId, isConnected }}
		>
			{children}
		</SocketContext.Provider>
	);
};

export function useSocketContext() {
	const context = useContext(SocketContext);

	if (!context) {
		throw new Error(
			"useSocketContext must be used within a SocketContextProvider",
		);
	}

	return context;
}
