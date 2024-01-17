"use client";

import useFetch from "@/hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Sidebar() {
	const session = useSession();
	const { fetchHandler } = useFetch();

	const {
		isPending,
		isError,
		refetch,
		data: Rooms,
		error,
	} = useQuery({
		queryKey: ["userRooms"],
		queryFn: () =>
			fetchHandler({
				url: `/room-members/user/${session.data?.user.id}`,
			}),
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

	// console.log(Rooms)

	return (
		<div>
			<h1>Sidebar</h1>

			<div className="space-y-6">
				{Rooms?.map((room: { id: string; title: string }) => (
					<Link href={`/chat/${room.id}`} className="" key={room.id}>
						{room.title}
					</Link>
				))}
			</div>
		</div>
	);
}
