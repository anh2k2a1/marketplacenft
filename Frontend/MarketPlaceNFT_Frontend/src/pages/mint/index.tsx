import React, { useState, type ChangeEvent, type FormEvent, useEffect } from "react";
import WalletConnectedBar from "../../components/wallet/WalletConnectedBar";
import '../../styles/mint/style.css'
import { FaUpload } from 'react-icons/fa'
import apiContract from "../../api/axiosInstanceForContract";

interface NFTAttribute {
    trait_type: string;
    value: string;
}
export const uploadToPinata = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const pinataApiKey = '056f7b11d4dbffd5f307';
    const pinataSecretApiKey = 'ae5ec0ac746dd17b21bb85b21fc13486f0b01b328e61f6f889207d7559cf8bdf'

    if (!pinataApiKey || !pinataSecretApiKey) {
        throw new Error('Pinata API keys không được thiết lập!');
    }

    try {
        const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'pinata_api_key': pinataApiKey,
                'pinata_secret_api_key': pinataSecretApiKey,
            },
            body: formData,
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Lỗi upload đến Pinata: ${res.status} - ${errorText}`);
        }

        const data = await res.json();
        if (data.IpfsHash) {
            return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
        } else {
            throw new Error('Không nhận được IpfsHash từ Pinata');
        }
    } catch (error) {
        console.error('Lỗi upload đến Pinata:', error);
        throw error;
    }
};

const CreateNFTPage: React.FC = () => {
    const [filePreview, setFilePreview] = useState<string | null>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // Lưu file object để upload sau
    const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | 'unknown'>('unknown');
    const [mediaName, setMediaName] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [putOnMarketplace, setPutOnMarketplace] = useState<boolean>(true);
    const [price, setPrice] = useState<string>("");
    const [royalties, setRoyalties] = useState<string>("10");
    const [unlockOncePurchased, setUnlockOncePurchased] = useState<boolean>(false);
    const [unlockableContent, setUnlockableContent] = useState<string>("");
    const [freeMinting, setFreeMinting] = useState<boolean>(false);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [attributes, setAttributes] = useState<NFTAttribute[]>([{ trait_type: "", value: "" }]);
    const [loading, setLoading] = useState<boolean>(false);
    const [mintSuccess, setMintSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [isUrlInputDisabled, setIsUrlInputDisabled] = useState<boolean>(false); // Trạng thái disable input URL
    const SERVICE_FEE = 1.75;

    const handleAttributeChange = (index: number, field: keyof NFTAttribute, value: string) => {
        const newAttrs = [...attributes];
        newAttrs[index][field] = value;
        setAttributes(newAttrs);
    };

    const addAttribute = () => setAttributes([...attributes, { trait_type: "", value: "" }]);
    const removeAttribute = (index: number) => setAttributes(attributes.filter((_, i) => i !== index));

    const handleMediaUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value.trim();
        setFilePreview(url);
        setSelectedFile(null); // Không có file nếu nhập URL

        if (url) {
            const ext = url.split('.').pop()?.toLowerCase() || '';
            const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
            const videoExts = ['mp4', 'webm', 'ogg', 'mov'];
            const audioExts = ['mp3', 'wav', 'ogg', 'flac'];

            if (imageExts.includes(ext)) {
                setMediaType('image');
            } else if (videoExts.includes(ext)) {
                setMediaType('video');
            } else if (audioExts.includes(ext)) {
                setMediaType('audio');
            } else {
                setMediaType('unknown');
            }

            setMediaName(url.split('/').pop() || "NFT Media");
        } else {
            setMediaType('unknown');
            setMediaName("");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Tạo preview local từ file
        const localPreviewUrl = URL.createObjectURL(file);
        setFilePreview(localPreviewUrl);
        setSelectedFile(file); // Lưu file để upload sau
        setIsUrlInputDisabled(true); // Disable input URL

        // Cập nhật mediaType và mediaName
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
        const videoExts = ['mp4', 'webm', 'ogg', 'mov'];
        const audioExts = ['mp3', 'wav', 'ogg', 'flac'];

        if (imageExts.includes(ext)) {
            setMediaType('image');
        } else if (videoExts.includes(ext)) {
            setMediaType('video');
        } else if (audioExts.includes(ext)) {
            setMediaType('audio');
        } else {
            setMediaType('unknown');
        }

        setMediaName(file.name);
    };

    const clearPreview = () => {
        if (filePreview && filePreview.startsWith('blob:')) {
            URL.revokeObjectURL(filePreview); // Revoke URL local nếu là preview từ file
        }
        setFilePreview(null);
        setSelectedFile(null);
        setMediaType('unknown');
        setMediaName("");
        setIsUrlInputDisabled(false); // Enable input URL trở lại
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!walletAddress) {
            alert("Vui lòng kết nối ví MetaMask trước!");
            return;
        }
        if (!filePreview || !name.trim()) {
            alert("Thiếu ảnh hoặc tên NFT!");
            return;
        }

        setLoading(true);

        try {
            let imageUrl = filePreview;

            // Nếu có file (tức là từ upload), upload lên Pinata trước
            if (selectedFile) {
                imageUrl = await uploadToPinata(selectedFile);
            }

            const metadata = {
                name: name.trim(),
                description: description.trim() || "",
                image: imageUrl,
                attributes: attributes.filter(a => a.trait_type && a.value)
            };
            const metadataBlob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
            const metadataBase64 = await new Promise<string>(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.readAsDataURL(metadataBlob);
            });

            const token = localStorage.getItem("token");
            const res = await apiContract.post(
                '/api/nft/mint',
                {
                    to: walletAddress,
                    imageUrl: imageUrl,
                    metadataUrl: metadataBase64
                },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                }
            );

            const data = res.data;

            if (data.success) {
                alert(`MINT THÀNH CÔNG!\nToken ID: ${data.tokenId}\nTx: https://sepolia.etherscan.io/tx/${data.txHash}`);
            } else {
                throw new Error(data.error || "Mint thất bại");
            }
        } catch (err: any) {
            console.error(err);
            alert("Lỗi: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWalletConnected = (address: string) => {
        console.log("Wallet connected:", address);  // Thêm log để debug
        setWalletAddress(address);
    };

    return (
        <main className="pt-20 min-h-screen text-gray-100" style={{
            background: "radial-gradient(1200px 600px at 10% 10%, rgba(125,61,254,0.08), transparent), linear-gradient(180deg,#0f0d10,#211b20 60%)",
        }}>
            <div className="mx-auto max-w-screen-xl px-6 py-12">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white text-center mb-4">
                    Create Token collectible
                </h1>
                <p className="text-center text-white/70 mb-8">Single edition on Ethereum</p>

                {/* Wallet Connected Bar */}
                <div className="flex z-10">
                    <WalletConnectedBar onConnect={handleWalletConnected} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* ==================== LEFT COLUMN ==================== */}
                    <form onSubmit={handleSubmit}>  {/* Thêm form bao quanh left column để handleSubmit hoạt động đúng */}
                        <div>
                            {/* Media URL Input - Thêm tùy chọn upload từ local */}
                            <div className="mb-10">
                                <label className="block text-lg font-semibold mb-4 text-white">
                                    Media URL <span className="text-red-500">*</span>
                                </label>
                                <p className="text-sm text-white/70 mb-4">
                                    Enter a direct link to your image, video, GIF, or audio file hosted on IPFS, Arweave, Pinata, etc. Or upload from local.
                                </p>
                                <div className="relative flex items-center gap-4">
                                    <input
                                        type="url"
                                        placeholder="https://ipfs.io/ipfs/Qm... hoặc https://arweave.net/..."
                                        value={filePreview || ""}
                                        onChange={handleMediaUrlChange}
                                        disabled={isUrlInputDisabled} // Disable nếu đã upload file
                                        className={`z-10 flex-1 px-4 py-3 rounded-lg bg-transparent border border-white/20 text-white placeholder-white/60 focus:border-purple-500 transition ${isUrlInputDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    />
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*,video/*,audio/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <span className="px-4 py-3 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition">
                                            <FaUpload className="inline mr-2" />
                                        </span>
                                    </label>
                                    {/* {filePreview && (
                                        <button
                                            type="button"
                                            onClick={clearPreview}
                                            className="absolute right-3 top-3.5 text-white/70 hover:text-red-400 transition"
                                        >
                                            ✕
                                        </button>
                                    )} */}
                                </div>
                                <p className="text-xs text-white/50 mt-2">
                                    Supported: IPFS (ipfs:// or https://gateway.pinata.cloud/ipfs/...), Arweave, HTTPS direct links. Upload will pin to Pinata.
                                </p>
                            </div>

                            {/* Hiển thị preview nhỏ ngay dưới input URL */}
                            {filePreview && (
                                <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/10 relative">
                                    <p className="text-sm text-white/70 mb-3">Preview from URL:</p>
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">
                                            {mediaType === "image" ? "Image" :
                                                mediaType === "video" ? "Video" :
                                                    mediaType === "audio" ? "Audio" : "File"}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white text-sm truncate max-w-md">{filePreview}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Put on marketplace */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Put on marketplace</h3>
                                    <p className="text-sm text-white/70">Enter price to allow users instantly purchase your NFT</p>
                                </div>
                                <div className={`w-14 h-8 rounded-full relative cursor-pointer transition ${putOnMarketplace ? "bg-purple-600" : "bg-gray-600"}`} onClick={() => setPutOnMarketplace(!putOnMarketplace)}>
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-transparent border border-white rounded-full transition-all duration-300 ${putOnMarketplace ? "translate-x-6" : ""}`} />
                                </div>
                            </div>

                            {putOnMarketplace && (
                                <>
                                    <div className="p-6 mb-8 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-lg font-medium">Price</label>
                                            <div className="flex items-center gap-3 z-10">
                                                <input
                                                    type="number"
                                                    step="0.000001"
                                                    min="0"
                                                    placeholder="Enter price"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-32 px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white text-right"
                                                />
                                                <span className="text-white text-lg">ETH</span>
                                            </div>
                                        </div>

                                        <div className="text-sm text-white/70 space-y-2">
                                            <div className="flex justify-between"><span>Price</span><span>{price || "-"} ETH</span></div>
                                            <div className="flex justify-between"><span>Rarible fee</span><span>1.75%</span></div>
                                            <div className="flex justify-between font-medium"><span>You will receive</span><span>{price ? (Number(price) * 0.9825).toFixed(4) : "-"} ETH</span></div>
                                        </div>
                                    </div>

                                    <div className="p-6 mb-8 rounded-xl bg-white/5 border border-white/10">
                                        <div className="flex justify-between items-center">
                                            {/* <span className="text-white">Date of listing expiration</span>
                                            <select className="bg-transparent text-black border border-white/20 px-4 py-2 rounded-lg z-10">
                                                <option>1 day</option>
                                                <option>3 days</option>
                                                <option>7 days</option>
                                                <option selected>30 days</option>
                                                <option>6 months</option>
                                            </select> */}
                                            <label className="text-lg font-medium">Category</label>
                                            <div className="flex items-center gap-3 z-10">
                                                <input
                                                    type="text"
                                                    placeholder="Enter category"
                                                    value={category}
                                                    onChange={(e) => setCategory(e.target.value)}
                                                    className="w-32 px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white text-right"
                                                />

                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Unlock once purchased */}
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-purple-400">Unlock once purchased</h3>
                                    <p className="text-sm text-white/70">Content will be unlocked after successful transaction</p>
                                </div>
                                <div className={`w-14 h-8 rounded-full relative cursor-pointer transition ${unlockOncePurchased ? "bg-purple-600" : "bg-gray-600"}`} onClick={() => setUnlockOncePurchased(!unlockOncePurchased)}>
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-transparent border border-white rounded-full transition-all duration-300 ${unlockOncePurchased ? "translate-x-6" : ""}`} />
                                </div>
                            </div>

                            {unlockOncePurchased && (
                                <div className="flex flex-col mb-8">
                                    <label className="block text-sm text-white/70 mb-2">Unlockable content (optional)</label>
                                    <textarea
                                        placeholder="Secret link, password, file..."
                                        value={unlockableContent}
                                        onChange={(e) => setUnlockableContent(e.target.value)}
                                        rows={3}
                                        className="z-10 w-full px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white placeholder-white/60"
                                    />
                                </div>
                            )}

                            {/* Choose collection - Giữ nguyên comment out */}
                            {/* <div className="mb-10">
                                <label className="block text-lg font-semibold mb-4 text-white">Choose collection</label>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${selectedCollection === "create" ? "border-purple-500 bg-purple-900/20" : "border-white/20"}`} onClick={() => setSelectedCollection("create")}>
                                        <div className="flex flex-col items-center text-white">
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-5xl font-bold text-white">+</div>
                                            <p className="mt-4 text-lg">Create</p>
                                            <p className="text-sm text-white/70">ERC-721</p>
                                        </div>
                                    </div>
                                    <div className={`p-8 rounded-xl border-2 transition-all cursor-pointer ${selectedCollection === "rari" ? "border-purple-500 bg-purple-900/20" : "border-white/20"}`} onClick={() => setSelectedCollection("rari")}>
                                        <div className="flex flex-col items-center text-white">
                                            <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-4xl">Ξ</div>
                                            <p className="mt-4 text-lg">Rarible x Ethereum</p>
                                            <p className="text-sm text-white/70">RARI</p>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                            {/* Free minting */}
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Free minting <span className="text-purple-400">?</span></h3>
                                    <p className="text-sm text-white/70">Buyer will pay gas fees for minting</p>
                                </div>
                                <div className={`w-14 h-8 rounded-full relative cursor-pointer transition ${freeMinting ? "bg-purple-600" : "bg-gray-600"}`} onClick={() => setFreeMinting(!freeMinting)}>
                                    <div className={`absolute top-1 left-1 w-6 h-6 bg-transparent border border-white rounded-full transition-all duration-300 ${freeMinting ? "translate-x-6" : ""}`} />
                                </div>
                            </div>

                            {/* Name & Description & Royalties */}
                            <div className="space-y-8">
                                <div className="flex flex-col">
                                    <label className="block text-lg font-semibold mb-2 text-white">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        placeholder="e.g. “Redeemable T-Shirt with logo”"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="z-10 w-full px-4 py-3 rounded-lg bg-transparent border border-white/20 text-white placeholder-white/60"
                                    />
                                </div>

                                <div className="flex flex-col mt-8">
                                    <label className="block text-lg font-semibold mb-2 text-white">Description (Optional)</label>
                                    <textarea
                                        placeholder="e.g. “After purchasing you'll be able to get the real T-Shirt”"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className="z-10 w-full px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white placeholder-white/60 "
                                    />
                                    <p className="text-sm text-white/70 mt-2">With preserved line-breaks</p>
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold mb-3 text-white">Royalties</label>
                                    <div className="flex gap-3 mb-3">
                                        {[0, 10, 20, 30].map((v) => (
                                            <button
                                                key={v}
                                                type="button"
                                                onClick={() => setRoyalties(v.toString())}
                                                className={`z-10 px-4 py-1.5 rounded-full text-sm ${royalties === v.toString() ? "bg-purple-600 text-white" : "bg-white/10 text-white/70"}`}>
                                                {v}%
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="number"
                                            min="0"
                                            max="50"
                                            step="0.5"
                                            value={royalties}
                                            onChange={(e) => setRoyalties(e.target.value)}
                                            className="w-32 px-4 py-3 rounded-lg bg-transparent border border-white/10 text-white z-10"
                                        />
                                        <span className="text-white">%</span>
                                    </div>
                                    <p className="text-sm text-white/70 mt-2">Maximum is 50%</p>
                                </div>
                            </div>

                            {/* Create button */}
                            <button
                                type="submit"
                                disabled={loading || !filePreview || !name.trim()}
                                className="w-full mt-12 py-5 bg-transparent border border-white/20 text-white text-xl font-bold rounded-full hover:bg-gray-900 transition transform hover:scale-105 disabled:opacity-50">
                                {loading ? "Creating item..." : "Create item"}
                            </button>
                        </div>
                    </form>

                    {/* ==================== RIGHT COLUMN - PREVIEW ==================== */}
                    <div className="lg:sticky lg:top-24 self-start w-full">
                        <h3 className="text-lg font-semibold mb-4 text-white">Preview</h3>
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-900/5 to-blue-900/5 p-12 min-h-96 flex flex-col items-center justify-center text-white/50 relative">

                            {filePreview ? (
                                <div className="relative inline-block"> {/* Wrapper để định vị nút × */}

                                    {/* Nút XÓA - GÓC TRÊN BÊN TRÁI của ảnh */}
                                    <button
                                        onClick={clearPreview}
                                        className="absolute -top-4 -left-4 z-50
                                                bg-red-600 hover:bg-red-700 active:scale-95
                                                text-white w-12 h-12 rounded-full 
                                                flex items-center justify-center 
                                                text-3xl font-bold 
                                                shadow-2xl border-4 border-black/50
                                                transition-all duration-200 
                                                hover:scale-110"
                                        title="remove media"
                                    >
                                        ×
                                    </button>

                                    {/* Ảnh / Video / Audio */}
                                    {mediaType === "image" && (
                                        <img
                                            src={filePreview}
                                            alt="NFT Preview"
                                            className="max-h-80 mx-auto object-contain rounded-lg shadow-2xl border-4 border-white/10"
                                        />
                                    )}
                                    {mediaType === "video" && (
                                        <video
                                            src={filePreview}
                                            controls
                                            autoPlay
                                            loop
                                            muted
                                            className="max-h-80 mx-auto object-contain rounded-lg shadow-2xl border-4 border-white/10"
                                        />
                                    )}
                                    {mediaType === "audio" && (
                                        <div className="text-center">
                                            <div className="text-9xl mb-6">Music</div>
                                            <audio controls src={filePreview} className="mt-4 w-64" />
                                        </div>
                                    )}
                                    {mediaType === "unknown" && (
                                        <div className="text-9xl mb-6">File</div>
                                    )}

                                    {/* Tên file bên dưới */}
                                    <p className="mt-6 text-white text-lg font-medium text-center truncate max-w-xs px-4">
                                        {mediaName || "Unnamed NFT"}
                                    </p>
                                </div>
                            ) : (
                                <p className="text-xl leading-tight text-center max-w-md">
                                    Upload file hoặc dán link để xem trước NFT của bạn
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default CreateNFTPage;