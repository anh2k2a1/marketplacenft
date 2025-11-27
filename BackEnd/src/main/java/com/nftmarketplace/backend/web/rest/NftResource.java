package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.nft.NftDTO;
import com.nftmarketplace.backend.domain.dto.nft.NftSummaryDTO;
import com.nftmarketplace.backend.service.NftService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;           // thêm import này
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NftResource {
    private static final Logger log = LoggerFactory.getLogger(NftResource.class);
    private final NftService nftService;

    @PostMapping
    public ResponseEntity<NftDTO> create(@Valid @RequestBody NftDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(nftService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<NftDTO>> getAll() {
        return ResponseEntity.ok(nftService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NftDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(nftService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NftDTO> update(@PathVariable Long id,@Valid @RequestBody NftDTO dto) {
        return ResponseEntity.ok(nftService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        nftService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/filter")
    public ResponseEntity<List<NftSummaryDTO>> filter(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String ownerWallet,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {

        return ResponseEntity.ok(
                nftService.filter(name, category, ownerWallet, minPrice, maxPrice)
        );
    }
    @PostMapping("/sync/nft-mint")
    public ResponseEntity<String> syncNftMint(@RequestBody NftDTO dto) {
        try {
            log.info("Sync NFT mint: tokenId={}, owner={}, categories={}",
                    dto.getTokenId(), dto.getContractAddress(), dto.getCategoryIds());

            // Hardcode contract nếu Node.js không gửi
            if (dto.getContractAddress() == null || dto.getContractAddress().isBlank()) {
                dto.setContractAddress("0x7Ac2FF9b8B4F8c0eF3dE6c8728B7BE880563bC2C"); // THAY BẰNG CONTRACT CỦA ANH
            }

            nftService.syncFromBlockchain(dto);
            return ResponseEntity.ok("Synced NFT #" + dto.getTokenId());
        } catch (Exception e) {
            log.error("Sync NFT failed", e);
            return ResponseEntity.badRequest().body("Sync failed: " + e.getMessage());
        }
    }

}
