package com.nftmarketplace.backend.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ListingDTO {
    private Long id;
    @NotNull(message = "NFT ID không được để trống")
    private Long nftId;
    private String nftName;
    private String imageUrl;
    @NotNull(message = "Giá listing không được để trống")
    @Min(value = 0, message = "Giá phải >= 0")
    private Double price;
    @NotBlank(message = "Currency bắt buộc")
    private String currency;      // MATIC / BNB
    @NotBlank(message = "sellerWallet không được để trống")
    private String sellerWallet;  // từ User
    private String status;        // active / sold / cancelled
    private LocalDateTime listedAt;
    private LocalDateTime soldAt;
}

