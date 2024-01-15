import { api } from "@/utils/asyncHandler";
const {serverApi} = api

export async function POST(req: Request) {
	const { username, password } = await req.json();

	const res = await serverApi
		.post("api/v1/auth/register", {
			json: { username: username, password: password },
		})
		.json();

	return Response.json(res);
}
