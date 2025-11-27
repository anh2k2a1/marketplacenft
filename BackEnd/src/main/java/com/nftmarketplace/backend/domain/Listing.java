package com.nftmarketplace.backend.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "listings")
@Getter
@Setter
@NoArgsConstructor
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "nft_id")
    private Nft nft;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private User seller;

    private Double price;
    private String currency;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "listed_at")
    private LocalDateTime listedAt;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    @OneToMany(mappedBy = "listing")
    private List<Order> orders;

    public enum Status { active, sold, cancelled }
}
