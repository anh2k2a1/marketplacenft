// nftController.ts
import { Request, Response } from "express";
import { mintNft } from "../services/nftService.ts";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() }).single("image");

export const mintController = async (req: Request, res: Response) => {
  try {
    const { to, name, description, imageUrl } = req.body;
    const imageBuffer = req.file?.buffer;
    const imageMimeType = req.file?.mimetype || "image/jpeg";

    const authHeader = req.headers.authorization;
    const result = await mintNft(
      to,
      name || "Untitled NFT",
      description || "",
      imageBuffer,
      imageUrl,
      imageMimeType,
      authHeader  // ← THÊM DÒNG NÀY!!!
    );

    res.json(result);
  } catch (error: any) {
    console.error("Lỗi mint NFT:", error.message || error);
    res.status(500).json({
      error: error.message || "Mint thất bại",
      details: error.response?.data || error.toString(),
    });
  }
};