package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Listing;
import com.nftmarketplace.backend.domain.Nft;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.ListingDTO;
import com.nftmarketplace.backend.domain.mapper.ListingMapper;
import com.nftmarketplace.backend.repository.jpa.ListingRepository;
import com.nftmarketplace.backend.repository.jpa.NftRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import com.nftmarketplace.backend.repository.query.ListingQueryRepositoryImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ListingService {

    private final ListingRepository listingRepository;
    private final NftRepository nftRepository;
    private final UserRepository userRepository;
    private final ListingMapper listingMapper;
    private final ListingQueryRepositoryImpl listingQueryRepository;

    // CREATE
    public ListingDTO create(ListingDTO dto) {
        Nft nft = nftRepository.findById(dto.getNftId())
                .orElseThrow(() -> new RuntimeException("NFT not found"));
        User seller = userRepository.findByWalletAddress(dto.getSellerWallet())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Listing listing = listingMapper.toEntity(dto, nft, seller);
        listing.setListedAt(LocalDateTime.now());
        Listing saved = listingRepository.save(listing);
        return listingMapper.toDto(saved);
    }

    // GET ALL
    public List<ListingDTO> getAll() {
        return listingRepository.findAll()
                .stream()
                .map(listingMapper::toDto)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ListingDTO getById(Long id) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        return listingMapper.toDto(listing);
    }

    // UPDATE
    public ListingDTO update(Long id, ListingDTO dto) {
        Listing listing = listingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Listing not found"));


        Nft nft = nftRepository.findById(dto.getNftId())
                .orElseThrow(() -> new RuntimeException("NFT not found"));
        User seller = userRepository.findByWalletAddress(dto.getSellerWallet())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        listing.setNft(nft);
        listing.setSeller(seller);
        listing.setPrice(dto.getPrice());
        listing.setCurrency(dto.getCurrency());

        if (dto.getStatus() != null) {
            Listing.Status newStatus = Listing.Status.valueOf(dto.getStatus());

            // nếu chuyển từ active → sold thì set thời gian bán
            if (newStatus == Listing.Status.sold && listing.getStatus() != Listing.Status.sold) {
                listing.setSoldAt(LocalDateTime.now());
            }

            // nếu chuyển lại active/cancelled thì bỏ soldAt
            if (newStatus != Listing.Status.sold) {
                listing.setSoldAt(null);
            }

            listing.setStatus(newStatus);
        }



        Listing saved = listingRepository.save(listing);
        return listingMapper.toDto(saved);
    }

    // DELETE
    public void delete(Long id) {
        if (!listingRepository.existsById(id))
            throw new RuntimeException("Listing not found");
        listingRepository.deleteById(id);
    }
    public List<ListingDTO> filter(String nftName,
                                   String sellerWallet,
                                   String status,
                                   Double minPrice,
                                   Double maxPrice) {
        return listingQueryRepository.filter(nftName, sellerWallet, status, minPrice, maxPrice)
                .stream()
                .map(listingMapper::toDto)
                .toList();
    }
}
