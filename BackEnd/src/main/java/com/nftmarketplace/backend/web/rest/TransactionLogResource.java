package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.TransactionLog;
import com.nftmarketplace.backend.domain.dto.TransactionLogDTO;
import com.nftmarketplace.backend.service.TransactionLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transaction-logs")
@RequiredArgsConstructor
public class TransactionLogResource {

    private final TransactionLogService transactionLogService;

    @PostMapping
    public ResponseEntity<TransactionLogDTO> create(@RequestBody TransactionLogDTO dto) {
        return ResponseEntity.ok(transactionLogService.create(dto));
    }

    @GetMapping
    public List<TransactionLogDTO> getAll() {
        return transactionLogService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionLogDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(transactionLogService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionLogDTO> update(@PathVariable Long id, @RequestBody TransactionLogDTO dto) {
        return ResponseEntity.ok(transactionLogService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        transactionLogService.delete(id);
        return ResponseEntity.noContent().build();
    }
}