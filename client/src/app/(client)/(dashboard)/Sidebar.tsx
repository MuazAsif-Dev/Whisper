"use client"

import useFetch from "@/hooks/useFetch"
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Sidebar() {

    const {fetchHandler} = useFetch()

	const {
		isPending,
		isError,
		refetch,
		data: Rooms,
		error,
	} = useQuery({
		queryKey: ["rooms"],
		queryFn: () =>
			fetchHandler({
				url: `/rooms`,
			}),
	});


	if (isPending) {
		return <div>Loading...</div>;
	}

	if (isError) {
		return <span>Error: {error.message}</span>;
	}

    console.log(Rooms)


  return (
    <div><h1>Sidebar</h1>
    
    <div className="space-y-6">
        {Rooms?.map((room)=>(
            <Link href={`/chat/${room.id}`} className="" key={room.id}>
                {room.title}
            </Link>
        ))}

        </div></div>
  )
}
