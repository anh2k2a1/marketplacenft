package com.nftmarketplace.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class CategoryDTO {
    private Long id;
    private String name;          // Art, Music, Game, ...
    private List<String> nftDescriptions;
    private Integer nftCount;     // số NFT trong category (computed)
}

