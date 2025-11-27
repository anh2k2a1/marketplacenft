package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Order;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class OrderQueryRepositoryImpl implements OrderQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public List<Order> filter(String buyerWallet,
                              String status,
                              LocalDateTime from,
                              LocalDateTime to,
                              Double minPrice,
                              Double maxPrice) {

        StringBuilder jpql = new StringBuilder(
                "SELECT o FROM Order o JOIN o.buyer b JOIN o.listing l JOIN l.nft n WHERE 1=1"
        );
        Map<String, Object> params = new HashMap<>();

        if (buyerWallet != null && !buyerWallet.isBlank()) {
            jpql.append(" AND b.walletAddress = :buyerWallet");
            params.put("buyerWallet", buyerWallet);
        }
        if (status != null && !status.isBlank()) {
            jpql.append(" AND o.status = :status");
            params.put("status", Order.Status.valueOf(status));
        }
        if (from != null) {
            jpql.append(" AND o.createdAt >= :from");
            params.put("from", from);
        }
        if (to != null) {
            jpql.append(" AND o.createdAt <= :to");
            params.put("to", to);
        }
        if (minPrice != null) {
            jpql.append(" AND o.price >= :minPrice");
            params.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            jpql.append(" AND o.price <= :maxPrice");
            params.put("maxPrice", maxPrice);
        }

        jpql.append(" ORDER BY o.createdAt DESC");

        TypedQuery<Order> query = em.createQuery(jpql.toString(), Order.class);
        params.forEach(query::setParameter);

        return query.getResultList();
    }
}

