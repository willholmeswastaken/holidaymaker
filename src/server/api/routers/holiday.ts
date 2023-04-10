import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import {
  type HolidayPhotoViewModel,
  type HolidayWithPhotoViewModel,
} from "@/types/HolidayWithPhoto";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/env.mjs";
import { logger } from "@/utils/logger";

const s3 = new S3Client({ region: env.AWS_REGION });

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
        photos.push({
          ...photo,
          photoUrl: await generateSignedUrl(
            photo.photoFileName,
            ctx.session.user.id
          ),
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
        title: z.string(),
        description: z.string(),
        visitedAt: z.string(),
        locationAddress: z.string(),
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
});

async function generateSignedUrl(fileName: string, userId: string) {
  const key = s3FilePathResolver(fileName, userId);
  const command = new GetObjectCommand({ Bucket: env.AWS_BUCKET, Key: key });
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
    return signedUrl;
  } catch (error) {
    logger.error("Error generating signed Url", error);
    return "";
  }
}
