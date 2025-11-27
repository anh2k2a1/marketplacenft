package com.nftmarketplace.backend.domain.dto.nft;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
public class NftDTO {
    private Long id;
    @NotNull(message = "tokenId không được để trống")
    private Long tokenId;
    @NotBlank(message = "contractAddress không được để trống")
    private String contractAddress;
    @NotBlank(message = "Tên NFT không được để trống")
    private String name;
    private String description;
    private String imageUrl;
    private String attributes;
    private String metadataUrl;
    @NotNull(message = "Price không được để trống")
    @Min(value = 0, message = "Price >= 0")
    private Double price;
    private Boolean isForSale;
    private LocalDateTime mintedAt;

    // chỉ giữ ID quan hệ
    @NotNull(message = "ownerId không được để trống")
    private Long ownerId;
    @NotNull(message = "creatorId không được để trống")
    private Long creatorId;
    private String OwnerWalletAddress;
    private Set<Long> categoryIds;
}

