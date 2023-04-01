import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "@/server/api/trpc";

export const holidayRouter = createTRPCRouter({
  getHolidays: protectedProcedure.query(async ({ ctx }) => {
    const holidays = await ctx.prisma.holiday.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        photos: true,
      },
    });

    return holidays.sort(
      (a, b) =>
        Date.parse(b.loggedAt.toISOString()) -
        Date.parse(a.loggedAt.toISOString())
    );
  }),
});
