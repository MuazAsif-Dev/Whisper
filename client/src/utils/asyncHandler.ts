import ky from "ky";

import { envClient } from "@/config/env.client";
import { envServer } from "@/config/env.server";

const serverApi = ky.create({ prefixUrl: envServer.API_BASE_URL });

const api = ky.create({ prefixUrl: envClient.API_BASE_URL });

export { api, serverApi };
