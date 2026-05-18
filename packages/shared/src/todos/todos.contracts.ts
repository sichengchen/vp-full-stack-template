import { z } from "zod";

export const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
  createdAt: z.number(),
});

export const createTodoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});

export const updateTodoSchema = z.object({
  completed: z.boolean(),
});

export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
