import { serve } from "@hono/node-server";
import { createDatabase, initializeLocalSchema } from "@template/db";
import { createApp } from "./app";
import { env } from "./env";

const { client, db } = createDatabase({
  url: env.DATABASE_URL,
  ...(env.DATABASE_AUTH_TOKEN ? { authToken: env.DATABASE_AUTH_TOKEN } : {}),
});

await initializeLocalSchema(client);

const app = createApp({
  db,
  corsOrigin: env.CORS_ORIGIN,
});

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`API listening on http://localhost:${info.port}`);
  },
);
