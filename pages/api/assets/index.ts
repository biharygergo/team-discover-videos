import { readdir } from "fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { join, resolve } from "path";

export const PATH_TO_ASSETS = resolve("pages", "api", "data", "assets");

export interface AssetCatalogItem {
  id: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  type: "video" | "audio" | "image";
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const files = await readdir(join(PATH_TO_ASSETS, "videos"));
  const imageFiles = await readdir(join(PATH_TO_ASSETS, "images"));
  const musicFiles = await readdir(join(PATH_TO_ASSETS, "music"));

  const catalog: AssetCatalogItem[] = files.map((path) => {
    const assetId = path.split(".")![0];
    return {
      id: assetId,
      videoUrl: `/api/assets/videos/${assetId}`,
      thumbnailUrl: `/api/assets/thumbnails/${assetId}`,
      type: "video",
    };
  });

  imageFiles.forEach((imagePath) => {
    const assetId = imagePath.split(".")![0];
    catalog.push({
      id: assetId,
      imageUrl: `/api/assets/images/${assetId}`,
      type: "image",
    });
  });

  musicFiles.forEach((musicPath) => {
    const assetId = musicPath.split(".")![0];
    catalog.push({
      id: assetId,
      imageUrl: `/api/assets/music/${assetId}`,
      type: "audio",
    });
  });

  return res.json(catalog);
}
