package com.nftmarketplace.backend.domain.mapper;


import com.nftmarketplace.backend.domain.Category;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.nft.NftDTO;
import com.nftmarketplace.backend.domain.dto.nft.NftSummaryDTO;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;


@Component
public class NftMapper {

    // convert DTO → Entity (khi tạo hoặc cập nhật)
    public Nft toEntity(NftDTO dto, User owner, User creator, Set<Category> categories) {
        Nft nft = new Nft();
        nft.setId(dto.getId());
        nft.setTokenId(dto.getTokenId());
        nft.setContractAddress(dto.getContractAddress());
        nft.setName(dto.getName());
        nft.setDescription(dto.getDescription());
        nft.setImageUrl(dto.getImageUrl());
        nft.setAttributes(dto.getAttributes());
        nft.setMetadataUrl(dto.getMetadataUrl());
        nft.setPrice(dto.getPrice());
        nft.setIsForSale(dto.getIsForSale());

        nft.setOwner(owner);
        nft.setCreator(creator);
        nft.setCategories(categories);
        return nft;
    }

    // convert Entity → DTO (trả về cho client)
    public NftDTO toDto(Nft nft) {
        NftDTO dto = new NftDTO();
        dto.setId(nft.getId());
        dto.setTokenId(nft.getTokenId());
        dto.setContractAddress(nft.getContractAddress());
        dto.setName(nft.getName());
        dto.setDescription(nft.getDescription());
        dto.setImageUrl(nft.getImageUrl());
        dto.setAttributes(nft.getAttributes());
        dto.setMetadataUrl(nft.getMetadataUrl());
        dto.setPrice(nft.getPrice());
        dto.setIsForSale(nft.getIsForSale());
        dto.setMintedAt(nft.getMintedAt());
        if (nft.getOwner() != null)
            dto.setOwnerId(nft.getOwner().getId());
        if (nft.getCreator() != null)
            dto.setCreatorId(nft.getCreator().getId());
        if (nft.getCategories() != null)
            dto.setCategoryIds(
                    nft.getCategories()
                            .stream()
                            .map(Category::getId)
                            .collect(Collectors.toSet())
            );

        return dto;
    }
    public NftSummaryDTO toSummary(Nft nft) {
        List<String> categories = nft.getCategories() == null ? List.of() :
                nft.getCategories().stream()
                        .map(Category::getName)
                        .toList();

        return new NftSummaryDTO(
                nft.getId(),
                nft.getName(),
                nft.getImageUrl(),
                nft.getPrice(),
                nft.getOwner() != null ? nft.getOwner().getWalletAddress() : null,
                categories
        );
    }

}

