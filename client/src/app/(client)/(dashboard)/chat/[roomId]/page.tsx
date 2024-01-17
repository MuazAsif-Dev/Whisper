"use client";

import { useSocketContext } from "@/context/SocketContext";
import socketEvents from "@/lib/socket/socketEvents";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
	content: string;
	id: string;
	userId: string;
	roomId: string;
	createdAt: string;
	editedAt: string;
	port: string;
	isDeleted: false;
};

export default function ChatRoom({ params }: { params: { roomId: string } }) {
	const messageListRef = useRef<HTMLOListElement | null>(null);
	const [newMessage, setNewMessage] = useState("");
	const [connectionCount, setConnectionCount] = useState(0);
	const [roomMessages, setRoomMessages] = useState<Message[]>([]);

	const { socket, messages, setMessages, setRoomId, isConnected } =
		useSocketContext();

	function scrollToBottom() {
		if (messageListRef.current) {
			messageListRef.current.scrollTop =
				messageListRef.current.scrollHeight + 1000;
		}
	}

	useEffect(() => {
		if (isConnected) {
			setRoomId(params.roomId);
			socket?.emit(socketEvents.ROOM_JOIN, {
				roomId: params.roomId,
			});
			console.count(`run ${socket?.connected} ${params.roomId}`);
		}
	}, [isConnected, params.roomId]);

	useEffect(() => {
		if (!messages) return;
		setRoomMessages(() => messages?.get(params.roomId) ?? []);
		setTimeout(() => {
			scrollToBottom();
		}, 0);
	}, [messages, params.roomId]);

	useEffect(() => {
		console.log({ roomMessages });
	}, [roomMessages]);

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 0);
	}, [newMessage]);

	useEffect(() => {
		socket?.on(
			socketEvents.CONNECTION_COUNT_UPDATED_CHANNEL,
			({ count }: { count: number }) => {
				setConnectionCount(count);
			},
		);
	}, [socket]);

	function handleSubmit(e: FormEvent) {
		e.preventDefault();

		socket?.emit(socketEvents.ROOM_NEW_MESSAGE, {
			roomId: params.roomId,
			message: newMessage,
		});
	}

	return (
		<main className="br500 flex flex-col p-4 w-full max-w-3xl m-auto">
			<h1 className="text-4xl font-bold text-center mb-4">
				Chat ({connectionCount})
			</h1>
			<ol
				className="flex-1 overflow-y-scroll overflow-x-hidden"
				ref={messageListRef}
			>
				{roomMessages &&
					roomMessages.map((m) => {
						return (
							<li
								className="bg-gray-100 rounded-lg p-4 my-2 break-all"
								key={m.id}
							>
								<p className="text-small text-gray-500">{m.userId}</p>
								<p className="text-small text-gray-500">{m.createdAt}</p>
								<p className="text-small text-gray-500">{m.port}</p>
								<p>{m.content}</p>
							</li>
						);
					})}
			</ol>

			<form onSubmit={handleSubmit} className="flex items-center">
				<input
					className="rounded-lg mr-4"
					placeholder="Tell is what's on your mind"
					value={newMessage}
					onChange={(e) => setNewMessage(e.target.value)}
					maxLength={255}
				/>

				<button className="h-full">Send message</button>
			</form>
		</main>
	);
}
