package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.user.UserProfileDTO;
import com.nftmarketplace.backend.domain.dto.nft.NftSummaryDTO;
import com.nftmarketplace.backend.domain.mapper.NftMapper;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import com.nftmarketplace.backend.repository.query.UserProfileQueryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserProfileQueryRepository profileQueryRepo;
    private final NftMapper nftMapper;

    public UserProfileDTO getProfile(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<NftSummaryDTO> created = profileQueryRepo.findCreatedNfts(userId)
                .stream().map(nftMapper::toSummary).toList();

        List<NftSummaryDTO> owned = profileQueryRepo.findOwnedNfts(userId)
                .stream().map(nftMapper::toSummary).toList();

        List<NftSummaryDTO> listed = profileQueryRepo.findListedNfts(userId)
                .stream().map(nftMapper::toSummary).toList();

        UserProfileDTO dto = new UserProfileDTO();
        dto.setUserId(user.getId());
        dto.setWalletAddress(user.getWalletAddress());
        dto.setUsername(user.getUsername());
        dto.setCreatedNfts(created);
        dto.setOwnedNfts(owned);
        dto.setListedNfts(listed);
        return dto;

    }
    public boolean updateOwnerAddress(Long userId, String newWalletAddress) {
        return userRepository.findById(userId)
            .map(user -> {
                user.setWalletAddress(newWalletAddress);
                userRepository.save(user);
                return true;
            })
            .orElse(false);
    }
}

