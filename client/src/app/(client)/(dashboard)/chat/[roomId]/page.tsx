"use client";

import useSocket from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = {
  message: string;
  id: string;
  createdAt: string;
  port: string;
};

export default function ChatRoom({ params }: { params: { roomId: string } }) {
  const messageListRef = useRef<HTMLOListElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [connectionCount, setConnectionCount] = useState(0);
  const socket = useSocket();
	const session = useSession();
	const router = useRouter();

    const CONNECTION_COUNT_UPDATED_CHANNEL = "chat:connection-count-updated";
    const NEW_MESSAGE_CHANNEL = "chat:new-message";
    const ROOM_JOIN = "chat:room:join"
    const ROOM_ALL_MESSAGES = `chat:room:${params.roomId}:messages`
    const ROOM_NEW_MESSAGE = "chat:room:new-message"
    
	if (!session.data || !session.data.user.access_token)
	{
		router.push("/login");
		router.refresh();
	}


  function scrollToBottom() {
    if (messageListRef.current) {
      messageListRef.current.scrollTop =
        messageListRef.current.scrollHeight + 1000;
    }
  }


    useEffect(()=>{
		if (!socket) return
        socket.emit(ROOM_JOIN, {
            roomId: params.roomId
        });
	},[])


  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected to socket");
    });

    socket?.on(ROOM_ALL_MESSAGES, (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);

      setTimeout(() => {
        scrollToBottom();
      }, 0);
    });

    // socket?.on(NEW_MESSAGE_CHANNEL, (message: Message) => {
    //   setMessages((prevMessages) => [...prevMessages, message]);

    //   setTimeout(() => {
    //     scrollToBottom();
    //   }, 0);
    // });

    socket?.on(
      CONNECTION_COUNT_UPDATED_CHANNEL,
      ({ count }: { count: number }) => {
        setConnectionCount(count);
      }
    );
  }, [socket]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    socket?.emit(ROOM_NEW_MESSAGE, {
        roomId: params.roomId,
      message: newMessage,
    });

    setNewMessage("");
  }

  return (
    <main className="flex flex-col p-4 w-full max-w-3xl m-auto">
      <h1 className="text-4xl font-bold text-center mb-4">
        Chat ({connectionCount})
      </h1>
      <ol
        className="flex-1 overflow-y-scroll overflow-x-hidden"
        ref={messageListRef}
      >
        {messages.map((m) => {
          return (
            <li
              className="bg-gray-100 rounded-lg p-4 my-2 break-all"
              key={m.id}
            >
              <p className="text-small text-gray-500">{m.createdAt}</p>
              <p className="text-small text-gray-500">{m.port}</p>
              <p>{m.message}</p>
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
