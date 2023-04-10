import { type Holiday, type HolidayPhoto } from "@prisma/client";

export type HolidayWithPhoto = Holiday & { photos: HolidayPhoto[] };

export interface HolidayPhotoViewModel extends HolidayPhoto {
  photoUrl: string;
}
export type HolidayWithPhotoViewModel = Holiday & {
  photos: HolidayPhotoViewModel[];
};
