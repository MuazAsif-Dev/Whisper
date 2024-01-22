import { SocketContextProvider } from "@/context/SocketContext";

export default function ChatLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<main className="flex flex-col p-4 w-full max-w-3xl m-auto">
			<div className="flex-1 py-2">
				<SocketContextProvider>{children}</SocketContextProvider>
			</div>
		</main>
	);
}
