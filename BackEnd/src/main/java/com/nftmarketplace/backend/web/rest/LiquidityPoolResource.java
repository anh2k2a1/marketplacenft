package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.LiquidityPoolDTO;
import com.nftmarketplace.backend.service.LiquidityPoolService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/liquidity-pools")
@RequiredArgsConstructor
public class LiquidityPoolResource {

    private final LiquidityPoolService liquidityPoolService;

    @GetMapping
    public ResponseEntity<List<LiquidityPoolDTO>> getAll() {
        return ResponseEntity.ok(liquidityPoolService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LiquidityPoolDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(liquidityPoolService.getById(id));
    }

    @PostMapping
    public ResponseEntity<LiquidityPoolDTO> create(@RequestBody LiquidityPoolDTO dto) {
        return ResponseEntity.ok(liquidityPoolService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<LiquidityPoolDTO> update(@PathVariable Long id, @RequestBody LiquidityPoolDTO dto) {
        return ResponseEntity.ok(liquidityPoolService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        liquidityPoolService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
