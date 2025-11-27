// src/providers/AutoConnectProvider.tsx
import React, { useEffect, useContext, createContext, useState } from 'react';
import { ethers } from 'ethers';

interface WalletContextType {
  account: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  connecting: boolean
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error('useWallet must be used within AutoConnectProvider');
  return context;
};

export const AutoConnectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const connect = async () => {
    if (!window.ethereum) {
      alert('Vui lòng cài MetaMask!');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      setAccount(addr);
      // localStorage.setItem('walletAddress', addr);
    } catch (error) {
      console.error('Connect failed:', error);
    }
  };

  const disconnect = async () => {
    setAccount(null);
    // localStorage.removeItem('walletAddress');
    try {
      const eth = (window as any).ethereum;
      if (!eth) {
        // nothing to revoke
        return;
      }
      await eth.request({
        method: 'wallet_revokePermissions',
        params: [{ eth_accounts: {} }],
      });
    } catch (err) {
      console.log('Revoke failed (có thể người dùng từ chối hoặc MetaMask cũ)', err);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('walletAddress');
    if (saved && window.ethereum) {
      connect();
    }

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setAccount(accounts[0]);
    };

    window.ethereum?.on('accountsChanged', handleAccountsChanged);
    window.ethereum?.on('chainChanged', () => window.location.reload());

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', () => { });
    };
  }, []);

  return (
    <WalletContext.Provider value={{ account, connect, disconnect, connecting }}>
      {children}
    </WalletContext.Provider>
  );
};