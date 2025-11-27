package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.LiquidityPool;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LiquidityPoolRepository extends JpaRepository<LiquidityPool, Long> {
}
