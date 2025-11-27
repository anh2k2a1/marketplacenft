package com.nftmarketplace.backend.domain.dto.user;

import com.nftmarketplace.backend.domain.dto.nft.NftSummaryDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class UserProfileDTO {

    private Long userId;
    private String walletAddress;
    private String username;

    private List<NftSummaryDTO> createdNfts;
    private List<NftSummaryDTO> ownedNfts;
    private List<NftSummaryDTO> listedNfts;


}

