package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
