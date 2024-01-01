"use client";

import { redirect } from "next/navigation";
import { FormEvent, useState } from "react";

import useSocket from "@/hooks/useSocket";

export default function Home() {
	const [username, setUsername] = useState("");
	const socket = useSocket();

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(username);

		if (!socket) return;

		socket.auth = { username };
		socket.connect();

		setUsername("");

		redirect("/chat");
	}

	return (
		<main className="m-auto flex h-screen w-full max-w-3xl flex-col p-4">
			<form onSubmit={onSubmit} className="flex gap-3">
				<input
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					type="text"
					className="rounded-md border border-black p-2"
				/>
				<button>Submit</button>
			</form>
		</main>
	);
}
