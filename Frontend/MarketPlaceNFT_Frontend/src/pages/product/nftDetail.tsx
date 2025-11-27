import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import type { Product } from "./index";
import "../../styles/product/style.css";

const mockProducts: Product[] = [
    { id: "1", title: "Neon Ape #01", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.5 ETH", category: "PFP", description: "A futuristic neon-styled ape avatar from the exclusive PFP collection." },
    { id: "2", title: "Cyber Punk #02", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "4.1 ETH", category: "PFP", description: "A cyberpunk-inspired character with glitch aesthetics and neon lights." },
    { id: "3", title: "Abstract Waves", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "1.2 ETH", category: "Art", description: "An abstract art composition featuring fluid waves and digital textures." },
    { id: "4", title: "Galaxy Dreams", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "3.1 ETH", category: "Art", description: "A cosmic dreamscape artwork inspired by deep space and star clusters." },
    { id: "5", title: "Racing Kart #05", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "5.3 ETH", category: "Game", description: "A high-speed NFT kart from a futuristic racing universe." },
    { id: "6", title: "Mystic Sword", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.8 ETH", category: "Game", description: "A legendary sword NFT infused with ancient magical power." },
    { id: "7", title: "Lo-fi Track #01", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "5.3 ETH", category: "Music", description: "A chill lo-fi music NFT with nostalgic beats and calming melodies." },
    { id: "8", title: "Retro Card #08", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.8 ETH", category: "Collectible", description: "A vintage-style digital collectible card with retro arcade vibes." },
];


const NFTDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (!id) return;
        const found = mockProducts.find((p) => p.id === id) ?? null;
        setProduct(found);

        // Cuộn trang lên đầu khi thay đổi sản phẩm
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    if (!product) {
        return (
            <main className="pt-24 min-h-screen bg-gradient-to-b from-[#050308] via-[#120c18] to-[#1d1524] text-gray-100">
                <div className="container mx-auto px-6">
                    <div className="max-w-xl mx-auto mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-xl shadow-2xl">
                        <h1 className="text-2xl font-semibold mb-2">Product not found</h1>
                        <p className="text-white/70">
                            The NFT you are looking for does not exist or has been removed.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
                        >
                            ← Go Back
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    const related = mockProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4);

    return (
        <main
            className="pt-24 min-h-screen text-gray-100"
            style={{
                paddingTop: '50px',
                background:
                    "radial-gradient(1000px 600px at 10% 0%, rgba(125,61,254,0.25), transparent), radial-gradient(900px 500px at 90% 100%, rgba(0,212,255,0.18), transparent), linear-gradient(180deg,#050308,#1a121f 60%, #050308)",
            }}
        >
            <div className="container mx-auto px-4 sm:px-6 pb-16">
                {/* Breadcrumb */}
                <div className="max-w-6xl mx-auto mb-6 flex items-center gap-2 text-sm text-white/60">
                    <Link to="/" className="hover:text-white transition">
                        Home
                    </Link>
                    <span>/</span>
                    <Link to="/product" className="hover:text-white transition">
                        Marketplace
                    </Link>
                    <span>/</span>
                    <span className="text-white">{product.title}</span>
                </div>

                {/* Main card */}
                <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">
                    {/* Left: Image */}
                    <div className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/40 via-fuchsia-500/20 to-cyan-400/30 blur-3xl opacity-80 pointer-events-none" />
                        <div className="relative bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.7)]">
                            {product.image && (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="relative z-10 space-y-6">
                        {/* Top meta */}
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            {product.category && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-purple-400/40 bg-purple-500/10 px-3 py-1 text-purple-200">
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                                    {product.category} Collection
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80">
                                Token ID: #{product.id}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                On sale
                            </span>
                        </div>

                        {/* Title + price */}
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
                                {product.title}
                            </h1>
                            {product.price && (
                                <div className="mt-4 flex items-baseline gap-3">
                                    <p className="text-3xl font-semibold text-amber-300">
                                        {product.price}
                                    </p>
                                    <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                                        Current Price
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Short description */}
                        <p className="text-base leading-relaxed text-white/75">
                            {product.description ||
                                "This is a unique digital collectible stored securely on the blockchain. Own, trade, or hold it as part of your premium NFT collection."}
                        </p>

                        {/* Stats row */}
                        <div className="grid grid-cols-3 gap-3 text-sm">
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/50">Owner</p>
                                <p className="mt-1 font-medium truncate">0x12...b9A4</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/50">Network</p>
                                <p className="mt-1 font-medium">Ethereum</p>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <p className="text-xs text-white/50">Royalties</p>
                                <p className="mt-1 font-medium">10%</p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-4">
                            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/40 transition">
                                Buy now
                            </button>
                            {/* <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/40 transition">
                                Add to wishlist
                            </button> */}
                            <Link
                                to="/product"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-white/20 bg-white/5 text-sm font-medium text-white/90 hover:bg-white/10 hover:border-white/40 transition"
                            // className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-transparent text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition"
                            >
                                ← Back to list

                            </Link>
                        </div>
                    </div>
                </section>

                {/* Detail + extra info */}
                <section className="max-w-6xl mx-auto mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-7 space-y-4">
                        <h2 className="text-lg font-semibold text-white">Description</h2>
                        <p className="text-sm sm:text-base leading-relaxed text-white/75">
                            {product.description ||
                                "This NFT is part of an exclusive collection, crafted with attention to detail and designed for collectors who value both aesthetics and rarity. You can hold it as your digital identity, trade it on secondary markets, or simply enjoy it in your personal gallery."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-3">Details</h3>
                            <ul className="space-y-2 text-sm text-white/75">
                                <li className="flex justify-between gap-4">
                                    <span className="text-white/50">Contract</span>
                                    <span className="font-mono truncate">0x9f...D21c</span>
                                </li>
                                <li className="flex justify-between gap-4">
                                    <span className="text-white/50">Token standard</span>
                                    <span>ERC-721</span>
                                </li>
                                <li className="flex justify-between gap-4">
                                    <span className="text-white/50">Blockchain</span>
                                    <span>Ethereum</span>
                                </li>
                                <li className="flex justify-between gap-4">
                                    <span className="text-white/50">Creator fees</span>
                                    <span>10%</span>
                                </li>
                            </ul>
                        </div>

                        <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
                            <h3 className="text-sm font-semibold text-white mb-3">Chain activity</h3>
                            <p className="text-xs text-white/60">
                                Activity history, offers and transfers will appear here.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Related NFTs */}
                {related.length > 0 && (
                    <section className="max-w-6xl mx-auto mt-12">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-white">
                                More from this collection
                            </h2>
                            <Link
                                to="/product"
                                className="text-sm text-white/60 hover:text-white transition z-10"
                            >
                                View all →
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {related.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/product/${item.id}`}
                                    className="group relative rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 overflow-hidden backdrop-blur-x1 hover:border-purple-500 transition-all duration-300"
                                >
                                    {/* Ảnh với hiệu ứng zoom */}
                                    {item.image && (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300 border-none"
                                        />
                                    )}

                                    {/* Lớp phủ chứa chữ "View All" */}
                                    <div className="absolute inset-0 flex justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white text-lg font-semibold">View All</span>
                                    </div>

                                    <div className="p-3 sm:p-4 space-y-1">
                                        <p className="text-xs text-white/50">{item.category}</p>
                                        <p className="text-sm font-medium text-white truncate">{item.title}</p>
                                        {item.price && (
                                            <p className="text-xs text-amber-300 font-semibold">{item.price}</p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
};

export default NFTDetail;