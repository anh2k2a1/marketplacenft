import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";
import hardhatVerify from "@nomicfoundation/hardhat-verify";
import * as dotenv from "dotenv";

dotenv.config();


const config: HardhatUserConfig = {
  plugins: [hardhatVerify],
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
      chainId: 31337,
      accounts: {
        count: 10,
      },
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.ALCHEMY_SEPOLIA || "https://eth-sepolia.g.alchemy.com/v2/uWe4vAwqREWWqpLqBYBNB",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  verify:{
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || "",
    },
  }
};

export default config;