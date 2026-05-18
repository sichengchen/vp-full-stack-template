import { createClient, type Client } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema/index";

export type DatabaseOptions = {
  url: string;
  authToken?: string;
};

export function createDatabase(options: DatabaseOptions) {
  const client = createClient({
    url: options.url,
    ...(options.authToken ? { authToken: options.authToken } : {}),
  });

  const db = drizzle(client, { schema });

  return { client, db };
}

export type Database = ReturnType<typeof createDatabase>["db"];

export async function initializeLocalSchema(client: Client) {
  await client.execute(`
    create table if not exists todos (
      id text primary key not null,
      title text not null,
      completed integer not null default 0,
      created_at integer not null
    )
  `);
}
