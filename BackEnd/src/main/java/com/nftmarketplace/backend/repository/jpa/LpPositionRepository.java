package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.LpPosition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LpPositionRepository extends JpaRepository<LpPosition, Long> {
}
