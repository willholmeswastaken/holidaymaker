import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import {
  type HolidayPhotoViewModel,
  type HolidayWithPhotoViewModel,
} from "@/types/HolidayWithPhoto";
import { getS3ImageUrl } from "@/utils/getS3ImageUrl";

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

    const holidaysParsed: HolidayWithPhotoViewModel[] = [];
    for (const holiday of holidays.sort(
      (a, b) =>
        Date.parse(b.loggedAt.toISOString()) -
        Date.parse(a.loggedAt.toISOString())
    )) {
      const photos: HolidayPhotoViewModel[] = [];
      for (const photo of holiday.photos) {
        const key = s3FilePathResolver(
          photo.photoFileName,
          ctx.session.user.id
        );
        photos.push({
          ...photo,
          photoUrl: await getS3ImageUrl(key),
        });
      }
      if (photos.length === 0) {
        photos.push({
          id: "default",
          photoUrl: "/default.jpeg",
          isCoverPhoto: true,
          holidayId: holiday.id,
          userId: ctx.session.user.id,
          uploadedAt: new Date(),
          photoFileName: "Default",
        });
      }

      holidaysParsed.push({
        ...holiday,
        photos,
      });
    }
    return holidaysParsed;
  }),
  createHoliday: protectedProcedure
    .input(
      z.object({
        title: z.string().nonempty(),
        description: z.string(),
        visitedAt: z.string().nonempty(),
        locationAddress: z.string().nonempty(),
        locationLat: z.number(),
        locationLng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const holiday = await ctx.prisma.holiday.create({
        data: {
          title: input.title,
          description: input.description,
          visitedAt: input.visitedAt,
          locationAddress: input.locationAddress,
          locationLat: input.locationLat,
          locationLng: input.locationLng,
          userId: ctx.session.user.id,
        },
      });

      return holiday.id;
    }),
  removeHoliday: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.holiday.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
