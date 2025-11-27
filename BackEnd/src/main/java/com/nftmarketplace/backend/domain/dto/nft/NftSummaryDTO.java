package com.nftmarketplace.backend.domain.dto.nft;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class NftSummaryDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private Double price;
    private String ownerWallet;
    private List<String> category;
}
