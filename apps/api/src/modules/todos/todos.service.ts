import { randomUUID } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { todos, type Database } from "@template/db";
import type { CreateTodoInput, UpdateTodoInput } from "@template/shared";

export function createTodoService(db: Database) {
  return {
    list() {
      return db.select().from(todos).orderBy(desc(todos.createdAt));
    },

    async create(input: CreateTodoInput) {
      const [todo] = await db
        .insert(todos)
        .values({
          id: randomUUID(),
          title: input.title,
          completed: false,
          createdAt: Date.now(),
        })
        .returning();

      return todo;
    },

    async update(id: string, input: UpdateTodoInput) {
      const [todo] = await db
        .update(todos)
        .set({ completed: input.completed })
        .where(eq(todos.id, id))
        .returning();

      return todo;
    },
  };
}
