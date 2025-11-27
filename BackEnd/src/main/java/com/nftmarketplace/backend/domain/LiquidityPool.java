package com.nftmarketplace.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "liquidity_pools")
@Getter
@Setter
@NoArgsConstructor
public class LiquidityPool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "pool_address")
    private String poolAddress;

    @Column(name = "token0_address")
    private String token0Address;

    @Column(name = "token1_address")
    private String token1Address;

    @Column(name = "token0_name")
    private String token0Name;

    @Column(name = "token1_name")
    private String token1Name;

    @Column(name = "reserve0")
    private Double reserve0;

    @Column(name = "reserve1")
    private Double reserve1;

    @Column(name = "lp_token_supply")
    private Double lpTokenSupply;

    @Column(name = "fee_tier")
    private Integer feeTier;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "pool")
    private List<LpPosition> positions;
}
