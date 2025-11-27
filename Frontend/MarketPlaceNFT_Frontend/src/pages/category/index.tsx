import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/product/style.css";

export interface Product {
    id: string;
    title: string;
    image?: string;
    price?: number | string;
    category?: string;
    [k: string]: any;
}

// ----- CATEGORY MỚI (PFP, Art, Game, Music, Collectible) -----
const mockProducts: Product[] = [
    { id: "1", title: "Neon Ape #01", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.5 ETH", category: "PFP" },
    { id: "2", title: "Cyber Punk #02", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "4.1 ETH", category: "PFP" },
    { id: "3", title: "Abstract Waves", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "1.2 ETH", category: "Art" },
    { id: "4", title: "Galaxy Dreams", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "3.1 ETH", category: "Art" },
    { id: "5", title: "Racing Kart #05", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "5.3 ETH", category: "Game" },
    { id: "6", title: "Mystic Sword", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.8 ETH", category: "Game" },
    { id: "7", title: "Lo-fi Track #01", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "0.8 ETH", category: "Music" },
    { id: "8", title: "Retro Card #08", image: new URL('../../assets/nft1.jpg', import.meta.url).href, price: "2.2 ETH", category: "Collectible" },
];

const CategoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    useEffect(() => {
        setProducts(mockProducts);
    }, []);

    // Danh sách category động dựa trên products
    const categories = useMemo(() => {
        const unique = Array.from(
            new Set(
                products
                    .map((p) => p.category)
                    .filter((c): c is string => Boolean(c))
            )
        );
        return ["all", ...unique];
    }, [products]);

    // Tính số lượng sản phẩm theo category để hiển thị trên tab
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = {};
        counts["all"] = products.length;

        products.forEach((p) => {
            const cat = p.category || "Unknown";
            counts[cat] = (counts[cat] || 0) + 1;
        });

        return counts;
    }, [products]);

    const filtered = useMemo(() => {
        let filteredProducts = products;

        // Lọc theo category đã chọn
        if (selectedCategory !== "all") {
            filteredProducts = filteredProducts.filter((p) => p.category === selectedCategory);
        }

        // Lọc theo search query
        if (query.trim()) {
            const q = query.trim().toLowerCase();
            filteredProducts = filteredProducts.filter((p) => {
                const title = (p.title || "").toLowerCase();
                const cat = (p.category || "").toLowerCase();
                return title.includes(q) || cat.includes(q);
            });
        }

        return filteredProducts;
    }, [products, query, selectedCategory]);

    return (
        <main
            className="pt-20 min-h-screen text-gray-100"
            style={{
                background:
                    "radial-gradient(1200px 600px at 10% 10%, rgba(125,61,254,0.08), transparent), linear-gradient(180deg,#0f0d10,#211b20 60%)",
            }}
        >
            <div className="mx-auto max-w-screen-xl px-6 py-12">
                {/* Top: Title + Search */}
                <div className="w-full mb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <div className="md:flex-0">
                            <h1 className="text-4xl sm:text-5xl font-extrabold text-white drop-shadow-md">
                                NFT Categories
                            </h1>
                            <p className="mt-3 text-lg text-white/70">
                                Explore curated NFT collections by category
                            </p>
                        </div>

                        {/* Search centered */}
                        <div className="w-full md:flex-1 flex justify-center">
                            <div className="w-full max-w-2xl flex items-center gap-3">
                                <div className="relative flex-1">

                                    <input
                                        id="product-search"
                                        className="premium w-full pl-14 pr-6 py-3 md:py-3.5 rounded-full text-white placeholder-white/60 focus:outline-none"
                                        type="search"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search by name or category ..."
                                        aria-label="Search NFTs"
                                        onKeyDown={(e) => { if (e.key === "Enter") (e.currentTarget as HTMLInputElement).blur(); }}
                                        style={{ zIndex: 10 }}
                                    />

                                    {/* CLEAR BUTTON */}
                                    {query.length > 0 && (
                                        <button
                                            onClick={() => setQuery("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/8 text-white text-sm hover:bg-black/30 transition"
                                            aria-label="Clear search"
                                            style={{ backdropFilter: "blur(4px)", zIndex: 20 }}
                                        >
                                            Clear
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden md:block md:flex-0 md:w-40" />
                    </div>
                </div>

                {/* Category Tabs / Filter */}
                <div className="flex justify-center gap-4 mb-32 flex-wrap custom-category-spacing">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-8 py-3.5 rounded-full font-semibold text-sm md:text-base transition-all transform hover:scale-105 
                             ${selectedCategory === cat
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-orange-500/30 border-2 border-white"
                                    : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10"
                                }`}
                        >
                            {cat === "all"
                                ? `All NFTs (${categoryCounts["all"] ?? 0})`
                                : `${cat} (${categoryCounts[cat] ?? 0})`}
                        </button>

                    ))}
                </div>

                {/* Current category title (khi không phải all) */}
                {selectedCategory !== "all" && filtered.length > 0 && (
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-white">
                            {selectedCategory} Collections
                        </h2>
                    </div>
                )}

                {/* Grid sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filtered.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-white/70">
                            Không tìm thấy NFT nào cho "
                            <span className="font-semibold text-white">{query || selectedCategory}</span>"
                        </div>
                    ) : (
                        filtered.map((p) => (
                            <div
                                key={p.id}
                                className="group relative rounded-2xl overflow-hidden transform transition-all duration-400 hover:-translate-y-3"
                            >
                                <div
                                    className="absolute inset-0 pointer-events-none rounded-2xl"
                                    aria-hidden="true"
                                    style={{
                                        background:
                                            "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                                        boxShadow: "0 10px 30px rgba(8,6,10,0.6), inset 0 1px 0 rgba(255,255,255,0.02)",
                                    }}
                                />

                                <div className="relative bg-transparent rounded-2xl border border-white/6 backdrop-blur-sm overflow-hidden">
                                    <div className="relative h-64 w-full rounded-t-2xl">
                                        <img
                                            src={p.image ?? "/assets/default.jpg"}
                                            alt={p.title}
                                            className="h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                                            loading="lazy"
                                        />

                                        <div
                                            className="absolute inset-0 pointer-events-none"
                                            style={{
                                                background:
                                                    'radial-gradient(50% 50% at 50% 30%, rgba(255,200,80,0.05), rgba(0,0,0,0.45))',
                                            }}
                                        />

                                        {p.category && (
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-black/50 text-white/90 border border-white/6">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="opacity-90">
                                                        <path d="M12 2l3 7h7l-5.6 4.2L19 22l-7-4-7 4 1.6-8.8L2 9h7l3-7z" fill="currentColor" />
                                                    </svg>
                                                    <span>{p.category}</span>
                                                </span>
                                            </div>
                                        )}

                                        <div className="absolute inset-0 flex items-end justify-center pb-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Link
                                                to={`/product/${p.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-yellow-400 to-orange-400 text-black shadow-lg hover:scale-105 transform transition"
                                            >
                                                View NFT
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M5 12h14M13 5l6 7-6 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <h2 className="text-lg font-bold text-white tracking-tight mb-1">{p.title}</h2>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs uppercase text-white/70 font-semibold">{p.category}</p>
                                                <p className="mt-2 text-sm font-medium text-yellow-300">{p.price}</p>
                                            </div>

                                            <div className="flex flex-col items-end">
                                                <span className="inline-block text-xs px-2 py-1 rounded-md bg-white/5 border border-white/6 text-white/80">Verified</span>
                                                <span className="mt-2 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/6 border border-white/6 text-white">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="opacity-90">
                                                        <path d="M12 17l-5-5 1.4-1.4L12 14.2l5.6-5.6L19 9l-7 8z" fill="currentColor" />
                                                    </svg>
                                                    Premium
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Link to={`/product/${p.id}`} className="absolute inset-0 z-0" aria-hidden="true" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </main>
    );
};

export default CategoryPage;
