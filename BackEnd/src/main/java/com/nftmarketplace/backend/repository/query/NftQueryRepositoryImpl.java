package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Nft;
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
public class NftQueryRepositoryImpl implements NftQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public List<Nft> filter(String name, String category, String ownerWallet,
                            Double minPrice, Double maxPrice) {

        StringBuilder jpql = new StringBuilder("SELECT n FROM Nft n WHERE 1=1");
        Map<String, Object> params = new HashMap<>();

        if (name != null && !name.isBlank()) {
            jpql.append(" AND LOWER(n.name) LIKE LOWER(CONCAT('%', :name, '%'))");
            params.put("name", name);
        }
        if (category != null && !category.isBlank()) {
            jpql.append(" AND EXISTS (");
            jpql.append("     SELECT c FROM n.categories c ");
            jpql.append("     WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :category, '%'))");
            jpql.append(" )");
            params.put("category", category);
        }
        if (ownerWallet != null && !ownerWallet.isBlank()) {
            jpql.append(" AND n.owner.walletAddress = :wallet");
            params.put("wallet", ownerWallet);
        }
        if (minPrice != null) {
            jpql.append(" AND n.price >= :minPrice");
            params.put("minPrice", minPrice);
        }
        if (maxPrice != null) {
            jpql.append(" AND n.price <= :maxPrice");
            params.put("maxPrice", maxPrice);
        }

        TypedQuery<Nft> query = em.createQuery(jpql.toString(), Nft.class);
        params.forEach(query::setParameter);
        return query.getResultList();
    }
}
