package com.nftmarketplace.backend.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity

@Table(name = "nfts")
@Getter
@Setter
@NoArgsConstructor
public class Nft {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "token_id")
    private Long tokenId;

    @Column(name = "contract_address")
    private String contractAddress;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")

    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "creator_id")
    private User creator;

    private String name;

    private String description;

    @Column(name = "image_url",columnDefinition = "LONGTEXT")
    private String imageUrl;


    private String attributes;

    @Column(name = "metadata_url", columnDefinition = "LONGTEXT")
    private String metadataUrl;

    private Double price;

    @Column(name = "is_for_sale")
    private Boolean isForSale;

    @Column(name = "minted_at")
    private LocalDateTime mintedAt;

    @OneToMany(mappedBy = "nft")
    private List<Listing> listings;

    @ManyToMany
    @JoinTable(
            name = "nft_categories",
            joinColumns = @JoinColumn(name = "nft_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> categories;
}
