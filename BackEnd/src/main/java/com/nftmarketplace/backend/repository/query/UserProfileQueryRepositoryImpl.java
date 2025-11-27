package com.nftmarketplace.backend.repository.query;

import com.nftmarketplace.backend.domain.Nft;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class UserProfileQueryRepositoryImpl implements UserProfileQueryRepository {

    @PersistenceContext
    private final EntityManager em;

    @Override
    public List<Nft> findCreatedNfts(Long userId) {
        String jpql = """
            SELECT n FROM Nft n 
            WHERE n.creator.id = :uid
        """;
        return em.createQuery(jpql, Nft.class)
                .setParameter("uid", userId)
                .getResultList();
    }

    @Override
    public List<Nft> findOwnedNfts(Long userId) {
        String jpql = """
            SELECT n FROM Nft n 
            WHERE n.owner.id = :uid
        """;
        return em.createQuery(jpql, Nft.class)
                .setParameter("uid", userId)
                .getResultList();
    }

    @Override
    public List<Nft> findListedNfts(Long userId) {
        String jpql = """
            SELECT n FROM Nft n
            JOIN Listing l ON l.nft.id = n.id
            WHERE l.seller.id = :uid
              AND l.status = 'ACTIVE'
        """;

        return em.createQuery(jpql, Nft.class)
                .setParameter("uid", userId)
                .getResultList();
    }
}

