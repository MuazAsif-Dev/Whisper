import { api } from "@/utils/asyncHandler";

export async function POST(req: Request) {
	const { email, password } = await req.json();

	const res = await api
		.post("/api/register", {
			json: { email: email, password: password },
		})
		.json();

	return Response.json(res);
}
