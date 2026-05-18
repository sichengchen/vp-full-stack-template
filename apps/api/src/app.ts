import { cors } from "hono/cors";
import { Hono } from "hono";
import type { Database } from "@template/db";
import { createTodoRoutes } from "./modules/todos/todos.routes";

type AppOptions = {
  db: Database;
  corsOrigin: string;
};

export function createApp({ db, corsOrigin }: AppOptions) {
  const app = new Hono();
  const api = new Hono();

  app.use(
    "*",
    cors({
      origin: corsOrigin,
      credentials: true,
    }),
  );

  app.get("/healthz", (c) =>
    c.json({
      ok: true,
      service: "api",
    }),
  );

  api.route("/todos", createTodoRoutes({ db }));
  app.route("/api", api);

  return app;
}
