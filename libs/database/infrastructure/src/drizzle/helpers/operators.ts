import type { SQL } from "drizzle-orm";
import type { AnyMySqlColumn } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export function lower(email: AnyMySqlColumn): SQL {
  return sql`(lower(${email}))`;
}
