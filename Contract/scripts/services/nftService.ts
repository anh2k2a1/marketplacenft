import { nftContract } from "../ExContract/nftcontract.ts";
import { syncToJava } from "../utils/axiosClient.ts";
import { uploadToIPFS } from "../utils/uploadToIPFS.ts";
import { ethers } from "ethers";
import { NFTStorage, File } from "nft.storage";
import * as dotenv from "dotenv";
dotenv.config();
// nftService.ts – thêm tham số authHeader
export const mintNft = async (
  to: string,
  name: string,
  description: string,
  imageBuffer?: Buffer,
  imageUrl?: string,
  imageMimeType: string = "image/jpeg",
  authHeader?: string  // ← THÊM DÒNG NÀY
) => {
  const metadataUrl = await uploadToIPFS(
    name,
    description,
    imageBuffer,
    imageUrl,
    imageMimeType
  );

  const tx = await nftContract.mint(to);
  await tx.wait();
  const tokenId = await nftContract.tokenCounter();

  await syncToJava(
    "/sync/nft-mint",
    {
      tokenId: tokenId.toString(),
      ownerAddress: to.toLowerCase(),
      txHash: tx.hash,
      blockNumber: (await tx.getBlock()).number,
      imageUrl: imageUrl || metadataUrl,
      metadataUrl,
      contractAddress: process.env.NFT_CONTRACT_ADDRESS,
      categoryIds: [1],
    },
    authHeader  // ← TRUYỀN VÀO ĐÂY!!!
  );

  return {
    success: true,
    tokenId: tokenId.toString(),
    txHash: tx.hash,
    metadataUrl,
    explorer: `https://sepolia.etherscan.io/tx/${tx.hash}`,
  };
};