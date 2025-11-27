// src/providers/NetworkConfigurationProvider.tsx
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';

interface NetworkConfig {
  chainId: number;
  rpcUrl: string;
  name: string;
  blockExplorerUrl: string;
}

interface NetworkContextType {
  network: NetworkConfig;
  switchNetwork: (chainId: number) => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

const NETWORKS = {
  sepolia: {
    chainId: 11155111,
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY',  // Thay key của bạn
    name: 'Sepolia Testnet',
    blockExplorerUrl: 'https://sepolia.etherscan.io'
  },
  mainnet: {
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/YOUR_ALCHEMY_KEY',
    name: 'Ethereum Mainnet',
    blockExplorerUrl: 'https://etherscan.io'
  },
} as const;

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) throw new Error('useNetwork must be used within NetworkConfigurationProvider');
  return context;
};

export const NetworkConfigurationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [network, setNetwork] = useState<NetworkConfig>(NETWORKS.sepolia);  // Default testnet

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
      setNetwork(NETWORKS[targetChainId === 1 ? 'mainnet' : 'sepolia']);
    } catch (error: any) {
      if (error.code === 4902) {  // Chain not added
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: NETWORKS[targetChainId === 1 ? 'mainnet' : 'sepolia'].name,
            rpcUrls: [NETWORKS[targetChainId === 1 ? 'mainnet' : 'sepolia'].rpcUrl],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            blockExplorerUrls: network.chainId === 1 
            ? ['https://etherscan.io'] 
            : ['https://sepolia.etherscan.io']
          }],
        });
      }
    }
  };

  return (
    <NetworkContext.Provider value={{ network, switchNetwork }}>
      {children}
    </NetworkContext.Provider>
  );
};