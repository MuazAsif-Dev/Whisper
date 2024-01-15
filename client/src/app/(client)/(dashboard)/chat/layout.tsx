"use client"

import useSocket from "@/hooks/useSocket";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
  const socket = useSocket();
	const session = useSession();


  useEffect(()=>{
    console.log("running effect")
		const token = session.data?.user.access_token
		if (!socket || !token) return
		socket.auth =  { token };
		socket.connect();

    console.log("-----running effect", {socket, token})
	},[])


  return (
    <main className="flex flex-col br500 p-4 w-full max-w-3xl m-auto">
      <div className="flex-1 py-2">{children}</div>
    </main>
  );
}
