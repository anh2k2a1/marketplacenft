import { PinataSDK, UploadResponse } from "pinata";
import * as dotenv from "dotenv";
dotenv.config();

const PINATA_JWT = process.env.PINATA_JWT?.trim();
if (!PINATA_JWT) throw new Error("Thiếu PINATA_JWT trong .env");

const pinata = new PinataSDK({
    pinataJwt: PINATA_JWT,
    pinataGateway: "ivory-characteristic-mastodon-453.mypinata.cloud",

});

export const uploadToIPFS = async (
  name: string = "Unnamed NFT",
  description: string = "No description",
  imageBuffer?: Buffer,
  imageUrl?: string,
  imageMimeType: string = "image/jpeg",
  attributes: Array<{ trait_type: string; value: string }> = []
): Promise<string> => {
  try {
    if (!imageBuffer && !imageUrl) {
      throw new Error("Phải có imageBuffer HOẶC imageUrl");
    }

    const safeName = String(name || "Unnamed_NFT").trim() || "Unnamed_NFT";

    let finalImage: string;
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim()) {
      finalImage = imageUrl.trim();
      console.log("Dùng link ảnh có sẵn:", finalImage);
    } else if (imageBuffer && imageBuffer.length > 0) {
      finalImage = `data:${imageMimeType};base64,${imageBuffer.toString("base64")}`;
      console.log("Nhúng base64 (GIF/PNG/JPG đều chạy ngon)");
    } else {
      throw new Error("Ảnh không hợp lệ");
    }

    // === TẠO METADATA ===
    const metadata = {
      name: safeName,
      description: description || "No description",
      image: finalImage,
      attributes: attributes || [],
    };

    // === TẠO FILE JSON ===
    const jsonStr = JSON.stringify(metadata, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const fileName = `${safeName.replace(/[^a-zA-Z0-9_-]/g, "_")}.json`;
    const file = new File([blob], fileName, { type: "application/json" });

    // === UPLOAD PINATA – DÙNG ĐÚNG TYPE MỚI ===
    const upload: UploadResponse = await pinata.upload.public.file(file, {
      metadata: { name: fileName },
    });

    // === LẤY CID (KHÔNG CÒN IpfsHash NỮA) ===
    const cid = upload.cid;
    if (!cid) throw new Error("Pinata không trả về CID");

    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    console.log("UPLOAD PINATA THÀNH CÔNG →", url);
    return url;

  } catch (error: any) {
    console.error("Upload IPFS thất bại:", error);
    throw new Error("IPFS upload failed: " + (error.message || String(error)));
  }
};