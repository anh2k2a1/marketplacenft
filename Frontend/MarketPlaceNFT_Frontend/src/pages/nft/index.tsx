// src/pages/MyNFTsPage.tsx  ← CHỈ GỌI API, KHÔNG GỌI CONTRACT
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useWallet } from "../../contexts/AutoConnectProvider"; 

interface NFT {
  tokenId: string;
  name: string;
  imageUrl: string;
  isListed: boolean;
  price?: string;
}

const MyNFTsPage: React.FC = () => {
  const { address } : any = useWallet();
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [sellPrice, setSellPrice] = useState<{ [key: string]: string }>({});
  const [selling, setSelling] = useState<string | null>(null);
  const loadMyNFTs = async () => {
    if (!address) {
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`/api/nft/my-nfts?owner=${address.toLowerCase()}`);
      setNfts(res.data.nfts || []);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải NFT");
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (tokenId: string) => {
    const price = sellPrice[tokenId];
    if (!price || parseFloat(price) <= 0) return alert("Nhập giá hợp lệ!");

    setSelling(tokenId);
    try {
      const res = await axios.post("/api/market/sell-my-nft", {
        tokenId,
        priceEth: price,
      });

      alert(`ĐĂNG BÁN THÀNH CÔNG NFT #${tokenId}!\nTx: ${res.data.txHash}`);
      loadMyNFTs(); // refresh
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.error || "Không thể đăng bán"));
    } finally {
      setSelling(null);
    }
  };

  useEffect(() => {
    loadMyNFTs();
  }, [address]);

  if (!address) return <div className="text-white text-center py-20">Vui lòng kết nối ví</div>;
  if (loading) return <div className="text-white text-center py-20">Đang tải NFT của bạn...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-10">My NFTs</h1>

        {nfts.length === 0 ? (
          <p className="text-xl text-gray-400">Bạn chưa sở hữu NFT nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {nfts.map((nft) => (
              <div key={nft.tokenId} className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700">
                <img src={nft.imageUrl} alt={nft.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold">{nft.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">ID: #{nft.tokenId}</p>

                  {nft.isListed ? (
                    <div className="mt-4 text-green-400 font-bold">
                      Đang bán: {nft.price} ETH
                    </div>
                  ) : (
                    <div className="mt-6 flex gap-3">
                      <input
                        type="number"
                        step="0.001"
                        placeholder="Giá ETH"
                        className="flex-1 px-4 py-3 bg-gray-700 rounded-lg text-white"
                        onChange={(e) => setSellPrice({ ...sellPrice, [nft.tokenId]: e.target.value })}
                      />
                      <button
                        onClick={() => handleSell(nft.tokenId)}
                        disabled={selling === nft.tokenId}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold disabled:opacity-50"
                      >
                        {selling === nft.tokenId ? "..." : "Sell"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNFTsPage;