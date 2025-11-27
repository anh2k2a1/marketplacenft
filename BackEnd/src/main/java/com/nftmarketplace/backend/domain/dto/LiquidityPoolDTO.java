package com.nftmarketplace.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class LiquidityPoolDTO {
    private Long id;
    private String poolAddress;
    private String token0Address;
    private String token1Address;
    private String token0Name;
    private String token1Name;
    private Double reserve0;
    private Double reserve1;
    private Double lpTokenSupply;
    private Integer feeTier;
    private LocalDateTime createdAt;
}
