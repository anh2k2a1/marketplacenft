import { Request, Response } from "express";
import { listForSale, cancelListing } from "../services/marketServices.ts";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() }).single("image");
export const ListForSaleController = async (req: Request, res: Response) => {
  try {
    const { to, name, description, imageUrl } = req.body;
    const {tokenId, price, durationHours,walletAddress} = req.body;
    const result = await listForSale(
      tokenId,
      price,
      durationHours,
      walletAddress
    );
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const CancelListingController = async (req: Request, res: Response) => {
    try {
        const {tokenId} = req.body;
        const result = await cancelListing(
            tokenId
        );
        res.json(result);
    }catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}