import { type Holiday, type HolidayPhoto } from "@prisma/client";

export type HolidayWithPhoto = Holiday & { photos: HolidayPhoto[] };
