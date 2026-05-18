import type { Context } from "hono";
import type { z } from "zod";

export function parseJsonBody<TSchema extends z.ZodType>(
  schema: TSchema,
  value: unknown,
  c: Context,
): z.infer<TSchema> | Response {
  const parsed = schema.safeParse(value);

  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  return parsed.data;
}
