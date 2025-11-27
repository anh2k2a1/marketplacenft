package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.Listing;
import org.springframework.data.jpa.repository.JpaRepository;
public interface ListingRepository extends JpaRepository<Listing, Long> {
}
