// scripts/deploy.ts
import { createRequire } from "module";
const require = createRequire(import.meta.url);
require("dotenv").config();

import { ethers } from "ethers";

const ALCHEMY = process.env.ALCHEMY_SEPOLIA!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

async function main() {
  const provider = new ethers.JsonRpcProvider(ALCHEMY);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  console.log("Deploying with wallet:", wallet.address);

  // 1. NFTContract
  const nftArtifact = require("../artifacts/contracts/NFTContract.sol/NFTContract.json");
  const NFTFactory = new ethers.ContractFactory(nftArtifact.abi, nftArtifact.bytecode, wallet);
  const nft = await NFTFactory.deploy();
  await nft.waitForDeployment();
  console.log("NFTContract deployed to:", await nft.getAddress());

  // 2. TokenContract
  const tokenArtifact = require("../artifacts/contracts/TokenContract.sol/TokenContract.json");
  const TokenFactory = new ethers.ContractFactory(tokenArtifact.abi, tokenArtifact.bytecode, wallet);
  const token = await TokenFactory.deploy("My Token", "MYT");
  await token.waitForDeployment();
  console.log("TokenContract deployed to:", await token.getAddress());

  // 3. UniswapV2Factory
  const factoryArtifact = require("../artifacts/contracts/UniswapV2Factory.sol/UniswapV2Factory.json");
  const FactoryFactory = new ethers.ContractFactory(factoryArtifact.abi, factoryArtifact.bytecode, wallet);
  const factory = await FactoryFactory.deploy(wallet.address);
  await factory.waitForDeployment();
  console.log("UniswapV2Factory deployed to:", await factory.getAddress());

  // 4. UniswapV2Router02
  const routerArtifact = require("../artifacts/contracts/UniswapV2Router02.sol/UniswapV2Router02.json");
  const RouterFactory = new ethers.ContractFactory(routerArtifact.abi, routerArtifact.bytecode, wallet);
  const WETH_SEPOLIA = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9";
  const router = await RouterFactory.deploy(await factory.getAddress(), WETH_SEPOLIA);
  await router.waitForDeployment();
  console.log("UniswapV2Router02 deployed to:", await router.getAddress());

  console.log("\nTất cả contract đã deploy xong!");
  console.log("Lưu lại các address này vào backend Java nhé!");
}

main().catch((error) => {
  console.error("Deploy failed:", error);
  process.exit(1);
});