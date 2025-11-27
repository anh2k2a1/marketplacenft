package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Order;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderQueryRepository {
    List<Order> filter(
            String buyerWallet,
            String status,
            LocalDateTime from,
            LocalDateTime to,
            Double minPrice,
            Double maxPrice
    );
}
