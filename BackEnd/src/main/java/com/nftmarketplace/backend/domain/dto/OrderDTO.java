package com.nftmarketplace.backend.domain.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter

public class OrderDTO {
    private Long id;
    private String nftName;
    private String imageUrl;
    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá phải >= 0")
    private Double price;
    private String status;
    @NotBlank(message = "Buyer wallet không được để trống")
    private String buyerWallet;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    @NotNull(message = "ListingId không được để trống")
    private Long listingId;
}
