"use client";

import { useSession } from "next-auth/react";

import { envClient } from "@/config/env.client";

export default function useFetch() {
	const session = useSession();

	if (!session.data || !session.data.user.access_token)
		console.error({
			error: "Unauthenticated useFetch() request. Please Login",
		});

	const access_token = session.data?.user.access_token;

	async function fetchHandler({
		url,
		options,
	}: {
		url: string;
		options?: RequestInit;
	}) {
		const res = await fetch(
			`${envClient.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/v1${url}`,
			{
				...options,
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			},
		);

		const result = await res.json();

		if (!res.ok){
			throw new Error(result.code)
		}

		return result;
	}

	return { fetchHandler };
}
