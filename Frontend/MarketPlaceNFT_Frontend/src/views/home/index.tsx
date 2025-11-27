// src/pages/Home.tsx (hoặc components/HomeView.tsx)
import type { FC, Dispatch, SetStateAction } from 'react';
import { MdGeneratingTokens } from 'react-icons/md';
import { useWallet } from '../../contexts/AutoConnectProvider';
import { useNavigate } from 'react-router-dom';
import pkg from '../../../package.json';

interface HomeViewProps {
  setOpenCreateModal: Dispatch<SetStateAction<boolean>>;
}

export const HomeView: FC<HomeViewProps> = ({ setOpenCreateModal }) => {
  const { account, connect, disconnect, connecting } = useWallet();
  const imagesCol1 = ["img-9", "img-14", "img-21", "img-22", "img-10", "img-13"];
  const imagesCol2 = ["img-6", "img-11", "img-13", "img-21", "img-8", "img-7"];
  const shortenAddress = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  const navigate = useNavigate();

  return (
    <section id="home" className="relative overflow-hidden pb-20 pt-[72px]">
      <div className="px-6 py-4">
        <div className="bg-default-950/40 rounded-2xl">
          <div className="container mx-auto max-w-7xl">
            <div className="p-6">
              <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
                {/* Animated background */}
                <div className="bg-primary/10 -z-1 start-0 absolute top-0 h-14 w-14 animate-[spin_10s_linear_infinite] rounded-2xl rounded-br-none rounded-tl-none"></div>

                <div>
                  <span className="text-primary bg-primary/20 rounded-md px-3 py-1 text-sm font-medium uppercase tracking-wider">
                    CREATE EVM TOKEN {pkg.version}
                  </span>
                  <h1 className="md:text-5xl/tight my-4 max-w-lg text-4xl font-medium text-white">
                    Create Your Own EVM Token in Minutes
                  </h1>
                  <p className="text-default-300 md:text-lg">
                    Deploy ERC-20 tokens on Ethereum, Sepolia, or any EVM chain. Fast, secure, and gas-optimized.
                  </p>

                  <div className="new_add_css mt-10 flex flex-wrap items-center gap-4">

                    <button
                      onClick={() => navigate('/mint')}
                      className="hover:bg-primary-hover group inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-6 py-3 text-white transition-all duration-500"
                    >
                      <span className="bg-primary/20 text-primary me-2 flex h-11 w-11 items-center justify-center rounded-full group-hover:bg-white/10 group-hover:text-white">
                        <MdGeneratingTokens className="h-6 w-6" />
                      </span>
                      Create Token
                    </button>

                    {account ? (
                      <div className="flex items-center gap-2 rounded-full bg-gray-800 px-4 py-2 text-sm">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>{shortenAddress(account)}</span>
                        <button
                          onClick={disconnect}
                          className="ml-2 text-red-400 hover:text-red-300"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={connect}
                        disabled={connecting}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                      >
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.255 2.998l4.81 1.805-1.805 4.81-3.005-1.805-3.005 1.805-1.805-4.81 4.81-1.805zM5.745 7.998l1.805 4.81-3.005 1.805-1.805-4.81 3.005-1.805zM18.255 7.998l-1.805 4.81 3.005 1.805 1.805-4.81-3.005-1.805zM8.745 12.998l1.805 4.81-3.005 1.805-1.805-4.81 3.005-1.805zM15.255 12.998l-1.805 4.81 3.005 1.805 1.805-4.81-3.005-1.805z" />
                        </svg>
                        {connecting ? 'Connecting...' : 'Connect MetaMask'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mx-auto h-[595px] overflow-hidden relative">
                  <div className="marquee grid grid-cols-2 gap-6 h-full">
                    <div className="relative overflow-hidden h-full">
                      <div className="animate-marquee-up flex flex-col gap-6">
                        {[...imagesCol1, ...imagesCol1].map((image, index) => (
                          <img
                            key={index}
                            src={`/assets/images/ai/${image}.jpg`}
                            alt=""
                            className="w-60 h-60 object-cover rounded-xl flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative overflow-hidden h-full">
                      <div className="animate-marquee-down flex flex-col gap-6">
                        {[...imagesCol2, ...imagesCol2].map((image, index) => (
                          <img
                            key={index}
                            src={`/assets/images/ai/${image}.jpg`}
                            alt=""
                            className="w-60 h-60 object-cover rounded-xl flex-shrink-0"
                          />
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};