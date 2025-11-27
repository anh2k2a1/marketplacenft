package com.nftmarketplace.backend.domain.mapper;


import com.nftmarketplace.backend.domain.Category;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.dto.CategoryDTO;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryMapper {

    public CategoryDTO toDto(Category entity) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());

        if (entity.getNfts() != null) {
            dto.setNftDescriptions(
                    entity.getNfts().stream()
                            .map(Nft::getDescription)
                            .toList()
            );
            dto.setNftCount(entity.getNfts().size());
        } else {
            dto.setNftDescriptions(List.of());
            dto.setNftCount(0);
        }

        return dto;
    }

    public Category toEntity(CategoryDTO dto) {
        Category c = new Category();
        c.setId(dto.getId());
        c.setName(dto.getName());
        // không set NFT vì quan hệ ManyToMany do service xử lý
        return c;
    }
}

