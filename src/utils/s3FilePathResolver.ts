export const s3FilePathResolver = (
  fileName: string,
  userId: string
): string => {
  return `${userId}/${fileName}`;
};
