package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Category;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.nft.NftDTO;
import com.nftmarketplace.backend.domain.dto.nft.NftSummaryDTO;
import com.nftmarketplace.backend.domain.mapper.NftMapper;
import com.nftmarketplace.backend.repository.jpa.CategoryRepository;
import com.nftmarketplace.backend.repository.jpa.NftRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import com.nftmarketplace.backend.repository.query.NftQueryRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class NftService {
    private final NftRepository nftRepository;
    private final UserRepository userRepository;
    private final NftMapper nftMapper;
    private final NftQueryRepository nftQueryRepository;

    private final CategoryRepository categoryRepository;
    public NftDTO create(NftDTO dto) {
        Set<Category> categories = new HashSet<>(categoryRepository.findAllById(dto.getCategoryIds()));

        User owner = userRepository.findById(dto.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found"));
        User creator = userRepository.findById(dto.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Creator not found"));

        Nft nft = nftMapper.toEntity(dto, owner, creator,categories);
        nft.setMintedAt(LocalDateTime.now());
        return nftMapper.toDto(nftRepository.save(nft)) ;
    }

    public List<NftDTO> getAll() {
        return nftRepository.findAll()
                .stream()
                .map(nftMapper::toDto)
                .toList();
    }

    public NftDTO getById(Long id) {
        return nftRepository.findById(id)
                .map(nftMapper::toDto)
                .orElseThrow(() -> new RuntimeException("NFT not found"));
    }

    public NftDTO update(Long id, NftDTO dto) {
        Nft nft = nftRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NFT not found"));

        nft.setName(dto.getName());
        nft.setDescription(dto.getDescription());
        nft.setImageUrl(dto.getImageUrl());
        nft.setPrice(dto.getPrice());
        nft.setIsForSale(dto.getIsForSale());
        nft.setAttributes(dto.getAttributes());
        nft.setMetadataUrl(dto.getMetadataUrl());
        nft.setContractAddress(dto.getContractAddress());
        nft.setTokenId(dto.getTokenId());

        return nftMapper.toDto(nftRepository.save(nft));
    }

    public void delete(Long id) {
        nftRepository.deleteById(id);
    }

    public List<NftSummaryDTO> filter(String name, String category,
                                      String ownerWallet, Double minPrice, Double maxPrice) {
        return nftQueryRepository.filter(name, category, ownerWallet, minPrice, maxPrice)
                .stream()
                .map(nftMapper::toSummary)
                .toList();
    }
    public void syncFromBlockchain(NftDTO dto) {
        User user = userRepository.findByWalletAddress(dto.getOwnerWalletAddress())
            .orElseGet(() -> {
        User newUser = new User();
        newUser.setWalletAddress(dto.getOwnerWalletAddress());                 // ← sửa ở đây
        String addr = dto.getOwnerWalletAddress();
        newUser.setUsername(addr != null ? addr.substring(0, Math.min(10, addr.length())) + "..." : "Anonymous");
        newUser.setCreatedAt(LocalDateTime.now());
        return userRepository.save(newUser);
    });

        String contractAddr = dto.getContractAddress() != null && !dto.getContractAddress().isBlank()
                ? dto.getContractAddress()
                : "0x8df5e0f62bcabE8c0e3fC86448439d4D7bff7fe3"; // THAY BẰNG CONTRACT THẬT CỦA ANH

        boolean exists = nftRepository.existsById(
                Long.parseLong(dto.getTokenId().toString())
        );
        if (exists) {
            return; 
        }

        // 3. Tạo NFT
        Nft nft = new Nft();
        nft.setTokenId(Long.parseLong(dto.getTokenId().toString()));
        nft.setContractAddress(contractAddr);
        nft.setOwner(user);
        nft.setCreator(user);
        nft.setImageUrl(dto.getImageUrl());
        nft.setMetadataUrl(dto.getMetadataUrl());
        nft.setMintedAt(LocalDateTime.now());
        nft.setIsForSale(false);
        nft.setPrice(null);

        nft.setName(extractNameFromMetadata(dto.getMetadataUrl(),dto));
        nft.setDescription("Minted from blockchain");

        if (dto.getCategoryIds() != null && !dto.getCategoryIds().isEmpty()) {
            Set<Category> categories = new HashSet<>(
                categoryRepository.findAllById(dto.getCategoryIds())
            );
            nft.setCategories(categories); // JPA tự insert vào nft_categories
        }

        nftRepository.save(nft);
    }
    private String extractNameFromMetadata(String metadataUrl,NftDTO dto) {
    if (metadataUrl == null || !metadataUrl.startsWith("data:application/json;base64,")) {
        return "NFT #" + dto.getTokenId();
    }
    try {
        String base64 = metadataUrl.split(",")[1];
        String json = new String(java.util.Base64.getDecoder().decode(base64));
        var matcher = java.util.regex.Pattern.compile("\"name\"\\s*:\\s*\"([^\"]+)\"").matcher(json);
        return matcher.find() ? matcher.group(1) : "Unnamed NFT #" + dto.getTokenId();
    } catch (Exception e) {
        return "NFT #" + dto.getTokenId();
    }
}

}
