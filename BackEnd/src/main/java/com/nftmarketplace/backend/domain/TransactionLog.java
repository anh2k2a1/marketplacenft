package com.nftmarketplace.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_logs")
@Getter
@Setter
@NoArgsConstructor
public class TransactionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "tx_hash")
    private String txHash;

    @Enumerated(EnumType.STRING)
    private TxType type;

    private Double amount;

    @Column(name = "token_address")
    private String tokenAddress;

    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "block_number")
    private Long blockNumber;

    @Enumerated(EnumType.STRING)
    private TxStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum TxType { mint, sell, buy, add_liquidity, remove_liquidity, create_pool }
    public enum TxStatus { pending, success, failed }
}

