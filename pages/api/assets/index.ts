import { readdir } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { join, resolve } from "path";

export const PATH_TO_ASSETS = resolve("pages", "api", "data", "assets");

export interface AssetCatalogItem {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: "video" | "audio";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const files = await readdir(join(PATH_TO_ASSETS, "videos"));
  const catalog: AssetCatalogItem[] = files.map((path) => {
    const assetId = path.split(".")![0];
    return {
      id: assetId,
      videoUrl: `/api/assets/videos/${assetId}`,
      thumbnailUrl: `/api/assets/thumbnails/${assetId}`,
      type: "video",
    };
  });

  return res.json(catalog);
}
