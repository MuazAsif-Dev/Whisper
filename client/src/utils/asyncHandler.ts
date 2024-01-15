import ky from "ky";

import { envClient } from "@/config/env.client";
import { envServer } from "@/config/env.server";

const serverApi = ky.create({ prefixUrl: envServer.API_BASE_URL });

const clientNextApi = ky.create({ prefixUrl: envClient.NEXT_PUBLIC_API_BASE_URL });

const clientServerApi = ky.create({ prefixUrl: envClient.NEXT_PUBLIC_BACKEND_API_BASE_URL });

export const api = { clientNextApi, clientServerApi, serverApi };
