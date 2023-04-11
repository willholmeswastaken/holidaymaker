import { prisma } from "@/server/db";
import { type NextApiRequest, type NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await prisma.holiday.deleteMany();

  res.status(200).json({ message: "All holidays deleted" });
}
