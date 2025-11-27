package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Nft;

import java.util.List;

public interface NftQueryRepository {
    List<Nft> filter(String name, String category, String ownerWallet,
                     Double minPrice, Double maxPrice);
}
