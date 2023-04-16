import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Redis } from "@upstash/redis";
import { logger } from "./logger";
import { env } from "@/env.mjs";

const photoExpirySeconds = 60 * 5;
const s3 = new S3Client({ region: env.AWS_REGION });
const redis = new Redis({
  url: env.UPSTASH_REDIS_ENDPOINT,
  token: env.UPSTASH_REDIS_TOKEN,
});

export const getS3ImageUrl = async (key: string) => {
  let photoUrl: string = (await redis.get<string>(key)) ?? "";
  if (!photoUrl || photoUrl.length === 0) {
    const redisSetResult = await redis.setex(
      key,
      photoExpirySeconds - 60,
      await generateSignedUrl(key)
    );
    if (redisSetResult === "OK") {
      photoUrl = (await redis.get<string>(key)) ?? "";
      logger.info(`Generated photo url for key ${key}`);
    } else {
      logger.error(
        `Error setting photo url in redis for key ${key}. Skipping photo url generation`,
        redisSetResult
      );
    }
  }
  return photoUrl;
};

async function generateSignedUrl(key: string) {
  const command = new GetObjectCommand({ Bucket: env.AWS_BUCKET, Key: key });
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: photoExpirySeconds,
    });
    return signedUrl;
  } catch (error) {
    logger.error("Error generating signed Url", error);
    return "";
  }
}
