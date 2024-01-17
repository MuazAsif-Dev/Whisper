const socketEvents = {
	CONNECTION_COUNT_UPDATED_CHANNEL: "chat:connection-count-updated",
	ROOM_NEW_MESSAGE: "chat:room:new-message",
	// NEW_MESSAGE_CHANNEL : "chat:new-message",
	ROOM_JOIN: "chat:room:join",
	// ROOM_ALL_MESSAGES : (roomId: string) =>
	//     `chat:room:${roomId}:messages` as const,
	ROOM_MESSAGES: "chat:room:messages",
} as const;

export default socketEvents;
