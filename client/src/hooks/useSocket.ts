import { envClient } from "@/config/env.client";
import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

export default function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(envClient.SOCKET_URL, {
      reconnection: true,
      upgrade: true,
      autoConnect: false,
      transports: ["websocket", "polling"],
    });

    setSocket(socketIo);

    return function () {
      socketIo.disconnect();
    };
  }, []);

  return socket;
}
