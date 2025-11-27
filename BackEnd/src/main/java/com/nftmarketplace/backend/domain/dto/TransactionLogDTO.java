package com.nftmarketplace.backend.domain.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class TransactionLogDTO {

    private Long id;
    private Long userId;

    private String txHash;
    private String type;
    private Double amount;
    private String tokenAddress;
    private Long relatedId;
    private Long blockNumber;
    private String status;
    private LocalDateTime createdAt;
}
