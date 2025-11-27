package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Listing;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
@RequiredArgsConstructor
public class ListingQueryRepositoryImpl implements ListingQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public List<Listing> filter(String nftName,
                                String sellerWallet,
                                String status,
                                Double minPrice,
                                Double maxPrice) {

        StringBuilder jpql = new StringBuilder(
                "SELECT l FROM Listing l JOIN l.nft n JOIN l.seller s WHERE 1=1"
        );

        Map<String, Object> params = new HashMap<>();

        if (nftName != null && !nftName.isBlank()) {
            jpql.append(" AND LOWER(n.name) LIKE LOWER(CONCAT('%', :nftName, '%'))");
            params.put("nftName", nftName);
        }
        if (sellerWallet != null && !sellerWallet.isBlank()) {
            jpql.append(" AND s.walletAddress = :sellerWallet");
            params.put("sellerWallet", sellerWallet);
        }
        if (status != null && !status.isBlank()) {
            jpql.append(" AND l.status = :status");
            params.put("status", Listing.Status.valueOf(status));
        }
        if (minPrice != null) {
            jpql.append(" AND l.price >= :minPrice");
            params.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            jpql.append(" AND l.price <= :maxPrice");
            params.put("maxPrice", maxPrice);
        }

        jpql.append(" ORDER BY l.listedAt DESC");

        TypedQuery<Listing> query = em.createQuery(jpql.toString(), Listing.class);
        params.forEach(query::setParameter);

        return query.getResultList();
    }
}

