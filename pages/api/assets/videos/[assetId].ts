import { createReadStream } from "fs";
import { stat } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { PATH_TO_ASSETS } from "..";

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const assetId = req.query.assetId as string;
  const filePath = join(PATH_TO_ASSETS, "videos", `${assetId}.mp4`);
  const fileStat = await stat(filePath);

  res.writeHead(200, {
    "Content-Type": "video/mp4",
    "Content-Length": fileStat.size,
  });

  const readStream = createReadStream(filePath);
  readStream.pipe(res);
}
