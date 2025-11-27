import { ethers } from "ethers";
import NFT_ABI from "../../artifacts/contracts/NFTContract.sol/NFTContract.json" with { type: "json" };
import * as dotenv from "dotenv";
dotenv.config();
const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_SEPOLIA!);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

export const nftContract = new ethers.Contract(
  process.env.NFT_CONTRACT_ADDRESS!,
  NFT_ABI.abi,
  wallet
);