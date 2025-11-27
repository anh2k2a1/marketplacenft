package com.nftmarketplace.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class LpPositionDTO {
    private Long id;
    private Long userId;
    private String username;
    private Long poolId;
    private String poolAddress;
    private Double lpTokens;
    private Double amount0Deposited;
    private Double amount1Deposited;
    private Double sharePercent;
    private LocalDateTime depositedAt;
    private Boolean withdrawn;
}
