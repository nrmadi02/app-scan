import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { userSeeder } from "./seeders/users.seeder";
import { config } from "dotenv";
import { clientSeeder } from "./seeders/client.seeder";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config({
  path: [".env", ".env.local", ".env.development"],
});

const buildPgConnStr = process.env.DATABASE_URL ?? "";
const postgresClient = postgres(buildPgConnStr);

export const database: PostgresJsDatabase = drizzle(postgresClient);

async function main() {
  console.log("Seeding...");
  await userSeeder(database);
  await clientSeeder(database);
}

main()
  .then(() => {
    console.log("Seed done.");
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(0);
  });
