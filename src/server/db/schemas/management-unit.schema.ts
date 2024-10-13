import { timestamp, varchar } from 'drizzle-orm/pg-core';
import { createTable } from './../schema';
import { sql } from 'drizzle-orm';

export const managementUnit = createTable('management_unit', {
  id: varchar('id', { length: 255 }).notNull().primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: varchar('name', { length: 255 }).notNull(),
  code: varchar('code', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at', {
    mode: 'date',
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
}) 