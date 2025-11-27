import {nftContract} from "../ExContract/nftcontract.ts";
import {syncToJava,putToJava} from "../utils/axiosClient.ts";
import {ethers} from "ethers";
export const listForSale = async(
    tokenId: number,
    price: number,
    durationHours: number = 72,
    walletAddress: string
) => {
    try{
        if (!tokenId || !price) {
            throw new Error("tokenId và price là bắt buộc");
        }

        const priceWei = ethers.parseEther(price.toString());
        const durationSeconds = durationHours * 3600;

        const tx = await nftContract.listForSale(tokenId, priceWei, durationSeconds);
        const receipt = await tx.wait();
        syncToJava("api/listings",{
            tokenId: Number(tokenId),
            seller: walletAddress.toLowerCase(),
            price: price,
            expireTime: Math.floor(Date.now() / 1000) + durationSeconds,
            status: "ACTIVE",
            txHash: tx.hash,
        })
        return{
            success: true,
            txHash: tx.hash,
            explorer: `https://sepolia.etherscan.io/tx/${tx.hash}`,
            message: `NFT #${tokenId} đã được đăng bán giá ${price} ETH`,
            };
    } catch (error: any) {
        console.error("List for sale failed:", error);
        throw new Error(error.message);
    }
}
export const cancelListing = async(
    tokenId: number,
) => {
    try{
        const tx = await nftContract.cancelListing(tokenId);
        await tx.wait();
        await putToJava("api/listings/cancel",{
            tokenId: Number(tokenId),
            status: "CANCELLED",
        });
        return{ success: true, message: "Hủy đăng bán thành công" };
    }catch (error: any) {
        console.error("Cancel listing failed:", error);
        throw new Error(error.message);
    }
}

