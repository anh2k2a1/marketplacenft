package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.Nft;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NftRepository extends JpaRepository<Nft, Long> {

}
