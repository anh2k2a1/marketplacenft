package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Listing;

import java.util.List;

public interface ListingQueryRepository {
    List<Listing> filter(
            String nftName,
            String sellerWallet,
            String status,        // "active", "sold", "cancelled"
            Double minPrice,
            Double maxPrice
    );
}
