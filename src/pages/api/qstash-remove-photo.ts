import { env } from "@/env.mjs";
import { logger } from "@/utils/logger";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type HolidayPhoto } from "@prisma/client";
import { verifySignature } from "@upstash/qstash/nextjs";
import { type NextApiRequest, type NextApiResponse } from "next";

const s3 = new S3Client({ region: env.AWS_REGION });

type RemovePhotoRequest = {
  photo: HolidayPhoto;
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info("QStash photo removal command called");
  const { photo } = req.body as RemovePhotoRequest;
  const key = s3FilePathResolver(photo.photoFileName, photo.userId);
  console.log(key);
  const command = new DeleteObjectCommand({ Bucket: env.AWS_BUCKET, Key: key });
  try {
    await s3.send(command);
    logger.info("Photo removed from S3");
    res.status(200).end();
  } catch (error) {
    logger.error("Error removing photo from S3", error);
    console.error(error);
    res.status(500).end();
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
