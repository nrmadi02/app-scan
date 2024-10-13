import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { npwpd } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findMany();
  }),
  getNPWPDUser: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.npwpd.findFirst({
      where: eq(npwpd.userId, ctx.session.user.id),
      with: {
        taxpayers: true,
      }
    });
  })
});
