package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Nft;

import java.util.List;

public interface UserProfileQueryRepository {
    List<Nft> findCreatedNfts(Long userId);
    List<Nft> findOwnedNfts(Long userId);
    List<Nft> findListedNfts(Long userId);
}
