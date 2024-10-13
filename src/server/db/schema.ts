import { relations, sql } from "drizzle-orm";
import {
  boolean,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `npwpd-app_${name}`);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const npwpd = createTable("npwpd", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  registrationNumber: varchar("registration_number", {
    length: 255,
  }).notNull(),
  registrationDate: timestamp("registration_date", {
    mode: "date",
    withTimezone: true,
  }),
  userId: varchar("user_id", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const npwpdRelations = relations(npwpd, ({ one, many }) => ({
  user: one(users, {
    fields: [npwpd.userId],
    references: [users.id],
  }),
  taxpayers: one(taxpayers),
  codes: many(codes),
}));

export const taxpayerTypeEnum = pgEnum("taxpayer_type", [
  "personal",
  "company",
]);

export const taxpayers = createTable("taxpayers", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  type: taxpayerTypeEnum("taxpayer_type").notNull(),
  identityNumber: varchar("identity_number", { length: 255 }).notNull(),
  identityNumberType: varchar("identity_number_type", {
    length: 255,
  }).notNull(),
  npwpdId: varchar("npwpd_id", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  address: varchar("address", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 255 }).notNull(),
  isActive: boolean("is_active").notNull().default(true),
  deactiveAt: timestamp("deactive_at", {
    mode: "date",
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const taxpayersRelations = relations(taxpayers, ({ one }) => ({
  npwpd: one(npwpd, {
    fields: [taxpayers.npwpdId],
    references: [npwpd.id],
  }),
}));

export const clients = createTable("clients", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  code: varchar("code", { length: 255 }),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const codes = createTable("codes", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  code: varchar("code", { length: 255 }),
  expiresAt: timestamp("expires_at", {
    mode: "date",
    withTimezone: true,
  }),
  isUsed: boolean("is_used").default(false),
  isLoggedIn: boolean("is_logged_in").default(false),
  userId: varchar("user_id").references(() => users.id),
  clientId: varchar("client_id").references(() => clients.id),
  createdAt: timestamp("created_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
});

export const clientsRelations = relations(clients, ({ many }) => ({
  codes: many(codes),
}));

export const codesRelations = relations(codes, ({ one }) => ({
  user: one(users, {
    fields: [codes.userId],
    references: [users.id],
  }),
  client: one(clients, {
    fields: [codes.clientId],
    references: [clients.id],
  }),
}));