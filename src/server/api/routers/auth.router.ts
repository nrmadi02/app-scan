import { sign } from "jsonwebtoken";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { codes, users } from "~/server/db/schema";
import { and, eq, gt } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

const JWT_SECRET = process.env.JWT_SECRET ?? "super-secret";

const createJWT = (userId: string, clientId: string): string | null => {
  try {
    return (
      sign as (payload: object, secret: string, options: object) => string
    )({ userId, clientId }, JWT_SECRET, { expiresIn: "1h" });
  } catch (error) {
    console.error("Failed to create JWT:", error);
    return null;
  }
};

const excludeFields = <T extends Record<string, unknown>, K extends keyof T>(
  data: T,
  fields: K[],
): Omit<T, K> => {
  fields.forEach((field) => delete data[field]); // Menghapus kolom yang tidak ingin dikembalikan
  return data;
};

export const authRouter = createTRPCRouter({
  signInQR: protectedProcedure
    .input(
      z.object({
        generatedCode: z.string().min(1, "Generated code is required"),
        userId: z.string().uuid("Invalid user ID format"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const validCode = await ctx.db
        .select()
        .from(codes)
        .where(
          and(
            eq(codes.code, input.generatedCode),
            eq(codes.isUsed, false),
            gt(codes.expiresAt, new Date()),
          ),
        );

      const user = await ctx.db.query.users.findFirst({
        where: and(eq(users.id, input.userId)),
      });

      if (!validCode[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid code",
        });
      }

      const token = createJWT(input.userId, validCode[0].clientId ?? "");
      if (!token) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create JWT",
        });
      }

      return {
        code: 200,
        message: "Signed in",
        status: true,
        data: {
          user: user && excludeFields(user, ["password"]),
          clientId: validCode[0].clientId,
          token,
        },
      };
    }),
});
