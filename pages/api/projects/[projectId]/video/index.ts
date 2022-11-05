import { createReadStream } from "fs";
import { stat } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { InMemoryVideoStore } from "../../../controllers/queue";
export const config = {
  api: {
    responseLimit: false,
  },
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const projectId = req.query.projectId as string;
  const media = req.query.media as string | undefined;
  if (req.method === "GET") {
    try {
      const videoItem = InMemoryVideoStore.getItem(projectId);
      if (!media) {
        return res.json(videoItem);
      } else {
        const fileStat = await stat(videoItem.latestFile);

        res.writeHead(200, {
          "Content-Type": "video/mp4",
          "Content-Length": fileStat.size,
        });

        const readStream = createReadStream(videoItem.latestFile);
        readStream.pipe(res);
      }
    } catch (e) {
      console.error(e);
      return res.json({
        error: `Something went wrong, the error is: ${(e as any).message}`,
      });
    }
  } else {
    return res.json({ error: "Method not supported" });
  }
}
