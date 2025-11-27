// src/components/NetworkSwitcher.tsx
import type { FC } from 'react';
import { useNetwork } from '../../contexts/NetworkConfigurationProvider';

const NetworkSwitcher: FC = () => {
  const { network, switchNetwork } = useNetwork();

  const networks = [
    { chainId: 11155111, name: 'Sepolia Testnet', color: 'bg-blue-500' },
    { chainId: 1, name: 'Ethereum Mainnet', color: 'bg-purple-500' },
  ];

  const currentNetwork = networks.find((n) => n.chainId === network.chainId);

  return (
    <div className="relative group">
      <button
        type="button"
        onClick={() => {
          const nextIndex = (networks.findIndex((n) => n.chainId === network.chainId) + 1) % networks.length;
          switchNetwork(networks[nextIndex].chainId);
        }}
        className={`
          flex items-center gap-2
          px-4 py-2.5
          bg-gray-800
          border border-gray-600
          rounded-xl
          text-white text-sm font-medium
          cursor-pointer
          transition-all duration-300
          hover:bg-gray-700 hover:border-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          shadow-lg
        `}
      >
        {/* Dot màu mạng */}
        <span className={`h-2 w-2 rounded-full ${currentNetwork?.color || 'bg-gray-500'}`} />
        <span>{currentNetwork?.name || 'Unknown Network'}</span>

        {/* Icon mũi tên */}
        <svg
          className={`
            h-4 w-4 text-gray-300 ml-1
            transition-transform duration-300
            group-hover:text-white group-focus-within:text-blue-400
          `}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Glow khi hover/focus */}
      <div className="absolute -inset-0.5 bg-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-300 -z-10" />
    </div>
  );
};

export default NetworkSwitcher;