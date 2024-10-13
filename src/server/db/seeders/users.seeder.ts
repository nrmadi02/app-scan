import { type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { npwpd, taxpayers, users } from "../schema";
import { hash } from "bcrypt";

export const userSeeder = async (database: PostgresJsDatabase) => {
  console.log("Seeding User...");
  await database.transaction(async (trx) => {
    const user = await trx
      .insert(users)
      .values({
        id: "025ef832-87a2-4384-8680-de6c8ffad5e4",
        name: "Nur Ahmadi" as string,
        password: await hash("password", 10),
        email: "nrmadi02@gmail.com",
        emailVerified: new Date(),
        image: null,
      })
      .onConflictDoNothing()
      .returning();

    const npwp = await trx
      .insert(npwpd)
      .values({
        id: "025ef832-87a2-4384-8680-de6c8ffad5d4",
        registrationNumber: "1234567890",
        registrationDate: new Date(),
        userId: user[0]?.id,
      })
      .onConflictDoNothing()
      .returning();

    await trx.insert(taxpayers).values({
      name: "Nur Ahmadi",
      type: "company",
      identityNumber: "1234567890",
      identityNumberType: "NPWP",
      npwpdId: npwp[0]?.id,
      email: "nrmadi02@gmail.com",
      address: "Jl. Kediri No. 123",
      phoneNumber: "081234567890",
      isActive: true,
    });
  });

  console.log("Seeding User... Done");
};
