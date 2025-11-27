package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.Listing;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.ListingDTO;
import org.springframework.stereotype.Component;

@Component
public class ListingMapper {
    public Listing toEntity(ListingDTO dto, Nft nft, User seller) {
        Listing l = new Listing();
        l.setId(dto.getId());
        l.setNft(nft);
        l.setSeller(seller);
        l.setPrice(dto.getPrice());
        l.setCurrency(dto.getCurrency());
        if (dto.getStatus() != null) {
            l.setStatus(Listing.Status.valueOf(dto.getStatus()));
        }

        return l;
    }

    public ListingDTO toDto(Listing l) {
        ListingDTO dto = new ListingDTO();
        dto.setId(l.getId());
        dto.setPrice(l.getPrice());
        dto.setCurrency(l.getCurrency());

        // chuyển Enum -> String
        if (l.getStatus() != null) {
            dto.setStatus(l.getStatus().name());
        }

        dto.setListedAt(l.getListedAt());
        dto.setSoldAt(l.getSoldAt());
        if (l.getNft() != null) {
            dto.setNftId(l.getNft().getId());
            dto.setNftName(l.getNft().getName());
            dto.setImageUrl(l.getNft().getImageUrl());
        }

        if (l.getSeller() != null) {
            dto.setSellerWallet(l.getSeller().getWalletAddress());
        }

        return dto;
    }

}
