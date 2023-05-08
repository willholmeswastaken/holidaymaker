import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  type HolidayPhotoViewModel,
  type HolidayWithPhotoViewModel,
} from "@/types/HolidayWithPhoto";
import { getHolidayDisplayPhotos } from "@/utils/getHolidayDisplayPhotos";
import { Client } from "@upstash/qstash";
import { env } from "@/env.mjs";

const qStashClient = new Client({
  token: env.UPSTASH_QSTASH_TOKEN,
});

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
      holidaysParsed.push({
        ...holiday,
        visitedAt: holiday.visitedAt.toISOString(),
        loggedAt: holiday.loggedAt.toISOString(),
        photos: await getHolidayDisplayPhotos(
          holiday.photos,
          ctx.session.user.id,
          holiday.id
        ),
      });
    }
    return holidaysParsed;
  }),
  getHolidayPhotos: protectedProcedure
    .input(z.object({ holidayId: z.string().nonempty() }))
    .query(async ({ ctx, input }) => {
      const holidayPhotos = await ctx.prisma.holidayPhoto.findMany({
        where: {
          userId: ctx.session.user.id,
          holidayId: input.holidayId,
        },
        orderBy: {
          isCoverPhoto: "desc",
        },
      });

      if (holidayPhotos.length === 0) {
        return [];
      }

      const holidayPhotosParsed: HolidayPhotoViewModel[] =
        await getHolidayDisplayPhotos(
          holidayPhotos,
          ctx.session.user.id,
          input.holidayId
        );

      return holidayPhotosParsed;
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
  editHoliday: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        title: z.string().nonempty(),
        description: z.string(),
        visitedAt: z.string().nonempty(),
        locationAddress: z.string().nonempty(),
        locationLat: z.number(),
        locationLng: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.holiday.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
      await ctx.prisma.holiday.update({
        data: {
          title: input.title,
          description: input.description,
          visitedAt: input.visitedAt,
          locationAddress: input.locationAddress,
          locationLat: input.locationLat,
          locationLng: input.locationLng,
          userId: ctx.session.user.id,
        },
        where: {
          id: input.id,
        },
      });
    }),
  removeHoliday: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const holiday = await ctx.prisma.holiday.findFirstOrThrow({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          photos: true,
        },
      });
      await ctx.prisma.holiday.delete({
        where: {
          id: input.id,
        },
      });
      for (const photo of holiday.photos) {
        await qStashClient.publishJSON({
          topic: env.QSTASH_PHOTO_REMOVAL_TOPIC,
          body: {
            photo: photo,
          },
        });
      }
    }),
  setCoverPhoto: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        holidayId: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.holiday.findFirstOrThrow({
        where: {
          id: input.holidayId,
          userId: ctx.session.user.id,
        },
      });
      await ctx.prisma.holiday.update({
        data: {
          photos: {
            updateMany: {
              data: {
                isCoverPhoto: false,
              },
              where: {
                holidayId: input.holidayId,
                NOT: {
                  id: input.id,
                },
              },
            },
            update: {
              where: {
                id: input.id,
              },
              data: {
                isCoverPhoto: true,
              },
            },
          },
        },
        where: {
          id: input.holidayId,
        },
      });
    }),
  removePhoto: protectedProcedure
    .input(
      z.object({
        id: z.string().nonempty(),
        holidayId: z.string().nonempty(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const holiday = await ctx.prisma.holiday.findFirstOrThrow({
        where: {
          id: input.holidayId,
          userId: ctx.session.user.id,
        },
        include: {
          photos: true,
        },
      });
      await ctx.prisma.holidayPhoto.delete({
        where: {
          id: input.id,
        },
      });
      await qStashClient.publishJSON({
        topic: env.QSTASH_PHOTO_REMOVAL_TOPIC,
        body: {
          photo: holiday.photos.find((x) => x.id === input.id),
        },
      });
    }),
});
