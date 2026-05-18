import { Hono } from "hono";
import { validator } from "hono/validator";
import type { Database } from "@template/db";
import { createTodoSchema, updateTodoSchema } from "@template/shared";
import { parseJsonBody } from "../../lib/http";
import { createTodoService } from "./todos.service";

type TodoRoutesOptions = {
  db: Database;
};

export function createTodoRoutes({ db }: TodoRoutesOptions) {
  const routes = new Hono();
  const todoService = createTodoService(db);

  routes.get("/", async (c) => {
    const todos = await todoService.list();

    return c.json(todos);
  });

  routes.post(
    "/",
    validator("json", (value, c) => parseJsonBody(createTodoSchema, value, c)),
    async (c) => {
      const input = c.req.valid("json");
      const todo = await todoService.create(input);

      return c.json(todo, 201);
    },
  );

  routes.patch(
    "/:id",
    validator("json", (value, c) => parseJsonBody(updateTodoSchema, value, c)),
    async (c) => {
      const id = c.req.param("id");
      const input = c.req.valid("json");
      const todo = await todoService.update(id, input);

      if (!todo) {
        return c.json({ error: "Todo not found" }, 404);
      }

      return c.json(todo);
    },
  );

  return routes;
}
