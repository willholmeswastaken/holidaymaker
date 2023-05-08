import { env } from "@/env.mjs";
import { logger } from "@/utils/logger";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { type HolidayPhoto } from "@prisma/client";
import { verifySignature } from "@upstash/qstash/nextjs";
import { type NextApiRequest, type NextApiResponse } from "next";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  logger.info("QStash photo removal command called");
  const photo = req.body as HolidayPhoto;
  const key = s3FilePathResolver(photo.photoFileName, photo.userId);
  const command = new DeleteObjectCommand({ Bucket: env.AWS_BUCKET, Key: key });
  try {
    const s3 = new S3Client({ region: env.AWS_REGION });
    await s3.send(command);
    logger.info("Photo removed from S3");
    res.status(200).end();
  } catch (error) {
    logger.error("Error removing photo from S3", error);
    res.status(500).end();
  }
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
