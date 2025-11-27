package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
