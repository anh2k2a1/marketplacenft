package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.LpPositionDTO;
import com.nftmarketplace.backend.service.LpPositionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lp-positions")
@RequiredArgsConstructor
public class LpPositionResource {

    private final LpPositionService lpPositionService;

    @GetMapping
    public ResponseEntity<List<LpPositionDTO>> getAll() {
        return ResponseEntity.ok(lpPositionService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LpPositionDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(lpPositionService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LpPositionDTO> create(@RequestBody LpPositionDTO dto) {
        return ResponseEntity.ok(lpPositionService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LpPositionDTO> update(@PathVariable Long id, @RequestBody LpPositionDTO dto) {
        return ResponseEntity.ok(lpPositionService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        lpPositionService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
