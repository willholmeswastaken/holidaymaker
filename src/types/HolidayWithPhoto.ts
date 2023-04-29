import { type Holiday, type HolidayPhoto } from "@prisma/client";

export type HolidayWithPhoto = Holiday & { photos: HolidayPhoto[] };

export interface HolidayPhotoViewModel
  extends Omit<HolidayPhoto, "uploadedAt"> {
  photoUrl: string;
  uploadedAt: string;
}
export type HolidayWithPhotoViewModel = Omit<
  Holiday,
  "visitedAt" | "loggedAt"
> & {
  photos: HolidayPhotoViewModel[];
  visitedAt: string;
  loggedAt: string;
};
