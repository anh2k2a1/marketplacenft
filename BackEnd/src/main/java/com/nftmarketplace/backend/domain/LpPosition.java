package com.nftmarketplace.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "lp_positions")
@Getter
@Setter
@NoArgsConstructor
public class LpPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne @JoinColumn(name = "pool_id")
    private LiquidityPool pool;

    @Column(name = "lp_tokens")
    private Double lpTokens;

    @Column(name = "amount0_deposited")
    private Double amount0Deposited;

    @Column(name = "amount1_deposited")
    private Double amount1Deposited;

    @Column(name = "share_percent")
    private Double sharePercent;

    @Column(name = "deposited_at")
    private LocalDateTime depositedAt;

    private Boolean withdrawn;
}
