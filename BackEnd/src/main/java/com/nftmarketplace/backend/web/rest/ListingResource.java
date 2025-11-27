package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.ListingDTO;
import com.nftmarketplace.backend.service.ListingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/listings")
@RequiredArgsConstructor
public class ListingResource {

    private final ListingService listingService;

    @PostMapping
    public ResponseEntity<ListingDTO> create(@Valid @RequestBody ListingDTO dto) {
        return ResponseEntity.ok(listingService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ListingDTO>> getAll() {
        return ResponseEntity.ok(listingService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ListingDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(listingService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ListingDTO> update(@PathVariable Long id,@Valid @RequestBody ListingDTO dto) {
        return ResponseEntity.ok(listingService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        listingService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/filter")
    public ResponseEntity<List<ListingDTO>> filter(
            @RequestParam(required = false) String nftName,
            @RequestParam(required = false) String sellerWallet,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        return ResponseEntity.ok(
                listingService.filter(nftName, sellerWallet, status, minPrice, maxPrice)
        );
    }
}
