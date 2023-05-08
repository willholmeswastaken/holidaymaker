import { logger } from "@/utils/logger";
import { verifySignature } from "@upstash/qstash/nextjs";
import { type NextApiRequest, type NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("If this is printed, the signature has already been verified");

  logger.info("Qstash hit");
  logger.info(JSON.stringify(req.body));

  console.log(req.body);
  // do stuff
  res.status(200).end();
}

export default verifySignature(handler);

export const config = {
  api: {
    bodyParser: false,
  },
};
