import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { clients } from "../schema";

export const clientSeeder = async (database: PostgresJsDatabase) => {
  console.log("Seeding Client...");

  await database.transaction(async (trx) => {
    await trx.insert(clients).values({
      id: "025ef832-87a2-4384-8680-de6c8ffad5e4",
      name: "APLIKASI PAJAK AIR PERMUKAAN",
      code: "APP-PAP",
    })
      .onConflictDoNothing()
      .returning()

    await trx.insert(clients).values({
      id: "025ef832-87a2-4384-8680-de6c8ffad5e5",
      name: "APLIKASI PAJAK ALAT BERAT",
      code: "APP-PAB",
    })
      .onConflictDoNothing()
      .returning()
  })

  console.log("Seeding Client... Done");
}