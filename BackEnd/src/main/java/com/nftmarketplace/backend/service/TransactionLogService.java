package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.TransactionLog;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.TransactionLogDTO;
import com.nftmarketplace.backend.domain.mapper.TransactionLogMapper;
import com.nftmarketplace.backend.repository.jpa.TransactionLogRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionLogService {

    private final TransactionLogRepository transactionLogRepository;
    private final UserRepository userRepository;
    private final TransactionLogMapper transactionLogMapper;

    public TransactionLogDTO create(TransactionLogDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TransactionLog entity = transactionLogMapper.toEntity(dto, user);
        entity.setCreatedAt(LocalDateTime.now());
        return transactionLogMapper.toDto(transactionLogRepository.save(entity));
    }

    public List<TransactionLogDTO> getAll() {
        return transactionLogRepository.findAll()
                .stream()
                .map(transactionLogMapper::toDto)
                .toList();
    }

    public TransactionLogDTO getById(Long id) {
        return transactionLogRepository.findById(id)
                .map(transactionLogMapper::toDto)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public TransactionLogDTO update(Long id, TransactionLogDTO dto) {
        TransactionLog entity = transactionLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        entity.setTxHash(dto.getTxHash());
        entity.setType(dto.getType() != null ? TransactionLog.TxType.valueOf(dto.getType()) : null);
        entity.setAmount(dto.getAmount());
        entity.setTokenAddress(dto.getTokenAddress());
        entity.setRelatedId(dto.getRelatedId());
        entity.setBlockNumber(dto.getBlockNumber());
        entity.setStatus(dto.getStatus() != null ? TransactionLog.TxStatus.valueOf(dto.getStatus()) : null);

        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            entity.setUser(user);
        }

        return transactionLogMapper.toDto(transactionLogRepository.save(entity));
    }

    public void delete(Long id) {
        transactionLogRepository.deleteById(id);
    }
}