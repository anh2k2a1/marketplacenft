
'use client';

import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
type WalletConnectedBarProps = {
    onConnect?: (address: string) => void;
};
export default function WalletConnectedBar({ onConnect }: WalletConnectedBarProps = {}) {
    const [account, setAccount] = useState<string | null>(null);
    const [chainId, setChainId] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    const shortenAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getNetworkName = (chainId: string) => {
        const networks: { [key: string]: string } = {
            '0x1': 'Ethereum',
            '0xaa36a7': 'Sepolia',
            '0x5': 'Goerli',
            '0x89': 'Polygon',
            '0xa4b1': 'Arbitrum',
            '0xa': 'Optimism',
            '0x38': 'BSC',
        };
        return networks[chainId] || 'Unknown Network';
    };

    const connectWallet = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            alert('Vui lòng cài MetaMask extension!');
            window.open('https://metamask.io/download/', '_blank');
            return;
        }

        try {
            // Yêu cầu kết nối
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts && accounts.length > 0) {
                setAccount(accounts[0]);
                const chain = await window.ethereum.request({ method: 'eth_chainId' });
                setChainId(chain);
                setIsConnected(true);
                onConnect?.(accounts[0]);
            }
        } catch (error: any) {
            console.error('Connect error:', error);
            if (error.code === 4001) {
                alert('Bạn đã từ chối kết nối ví.');
            }
        }
    };

    const disconnectWallet = async () => {
        setAccount(null);
        setChainId(null);
        setIsConnected(false);
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

    // Tự động kiểm tra nếu đã kết nối sẵn khi reload trang
    useEffect(() => {
        const eth = (window as any).ethereum;
        if (!eth) return;

        const checkConnection = async () => {
            try {
                const accounts = await eth.request({ method: 'eth_accounts' });
                if (accounts?.length > 0) {
                    setAccount(accounts[0]);
                    const chain = await eth.request({ method: 'eth_chainId' });
                    setChainId(chain);
                    setIsConnected(true);
                    onConnect?.(accounts[0]);
                }
            } catch (err) {
                console.error('Auto check connection error:', err);
                // Optional: disconnectWallet();
            }
        };

        checkConnection(); // vẫn có thể thêm .catch nếu muốn

        // Lắng nghe sự kiện thay đổi tài khoản hoặc mạng
        eth.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length === 0) {
                disconnectWallet();
            } else {
                setAccount(accounts[0]);
            }
        });

        eth.on('chainChanged', (chain: string) => {
            setChainId(chain);
            window.location.reload(); // reload để tương thích với một số dApp
        });

        return () => {
            eth.removeAllListeners?.();
        };
    }, [[onConnect]]);

    // Nếu chưa kết nối → hiện button Connect
    if (!isConnected) {
        return (
            <button
                onClick={connectWallet}
                className="w-full px-6 py-4 mb-10 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 z-10"
            >
                Connect MetaMask Wallet
            </button>
        );
    }

    // Đã kết nối → hiện thanh giống thiết kế cũ của bạn
    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 mb-10 backdrop-blur-md">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                    Ξ
                </div>
                <div>
                    <p className="text-white font-medium">{shortenAddress(account!)}</p>
                    <p className="text-white/70 text-sm">{getNetworkName(chainId!)}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span className="px-4 py-1.5 bg-green-600/20 text-green-400 text-sm font-medium rounded-full">
                    Connected
                </span>
                <button
                    onClick={disconnectWallet}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    title="Disconnect"
                >
                    <LogOut size={18} />
                </button>
            </div>
        </div>
    );
}