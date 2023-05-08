import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { type NextApiRequest, type NextApiResponse } from "next";
import formidable, { type File } from "formidable";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import { env } from "@/env.mjs";
import { s3FilePathResolver } from "@/utils/s3FilePathResolver";
import { getSession } from "next-auth/react";
import { prisma } from "@/server/db";
import { logger } from "@/utils/logger";

const s3 = new S3Client({ region: env.AWS_REGION });

export const config = {
  api: {
    bodyParser: false,
  },
};

async function uploadToS3(bucket: string, key: string, filePath: string) {
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileStream,
  });

  try {
    await s3.send(command);
    return true;
  } catch (error) {
    console.error("Error uploading file to S3", error);
    return false;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    logger.info(
      "Upload photo request received, validating user session exists"
    );
    const session = await getSession({ req });
    if (!session || !session.user) {
      res.status(401).end();
      logger.warn("User does not exist, returning 401 status code");
      return;
    }

    if (!req.query.holidayId) {
      res.status(400).end();
      logger.warn("No holidayId was provided, returning 400 status code");
      return;
    }

    try {
      await prisma.holiday.findFirstOrThrow({
        where: {
          id: req.query.holidayId as string,
          userId: session.user.id,
        },
      });
    } catch (error) {
      res.status(404).end();
      logger.warn("Holiday does not exist, returning 404 status code");
      return;
    }

    logger.info("User session exists, parsing form data");
    const form = new formidable.IncomingForm();
    const { files } = await new Promise<{
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, _fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        resolve({ files });
      });
    });

    if (!files.file) {
      res.status(400).end();
      logger.warn("No photo file was uploaded, returning 400 status code");
      return;
    }
    const file = files.file as File;
    if (!file.mimetype?.startsWith("image/")) {
      res.status(400).send("File must be an image");
      logger.warn("File was not an image, returning 400 status code");
      return;
    }
    logger.info("Photo file was submitted, uploading to S3");
    const fileExtension = file.originalFilename?.split(".").pop() ?? "";
    const fileName = `${uuidv4()}.${fileExtension}`;

    const uploaded = await uploadToS3(
      env.AWS_BUCKET,
      s3FilePathResolver(fileName, session.user.id),
      file.filepath
    );

    if (!uploaded) {
      res.status(500).end();
      logger.error(
        "Photo file failed to upload to S3, returning 500 status code"
      );
      return;
    }

    logger.info("Photo file uploaded to S3, creating holiday photo record");

    try {
      const holidayId = req.query.holidayId?.toString();
      logger.info("Creating holiday photo");
      await prisma.holidayPhoto.create({
        data: {
          userId: session.user.id,
          photoFileName: fileName,
          holidayId,
          isCoverPhoto: req.query.isCoverPhoto === "true",
        },
      });
      logger.info("Created holiday photo");

      res.status(200).send({});
    } catch (e) {
      logger.error("S3 File Upload Failed:", e);
      res.status(500).send({});
    }
  } else {
    logger.error("Method not allowed on upload-photo endpoint: ", req.method);
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
