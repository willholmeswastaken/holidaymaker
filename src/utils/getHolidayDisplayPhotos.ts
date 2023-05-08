import { type HolidayPhotoViewModel } from "@/types/HolidayWithPhoto";
import { type HolidayPhoto } from "@prisma/client";
import { getS3ImageUrl } from "./getS3ImageUrl";
import { s3FilePathResolver } from "./s3FilePathResolver";

export const getHolidayDisplayPhotos = async (
  holidayPhotos: HolidayPhoto[],
  userId: string,
  holidayId: string
) => {
  const photos: HolidayPhotoViewModel[] = [];

  for (const photo of holidayPhotos) {
    const key = s3FilePathResolver(photo.photoFileName, userId);
    photos.push({
      ...photo,
      uploadedAt: photo.uploadedAt.toISOString(),
      photoUrl: await getS3ImageUrl(key),
    });
  }
  if (photos.length === 0) {
    photos.push({
      id: "default",
      photoUrl: "/default.jpeg",
      isCoverPhoto: true,
      holidayId,
      userId,
      photoFileName: "Default",
      uploadedAt: new Date().toISOString(),
    });
  }
  return photos;
};
