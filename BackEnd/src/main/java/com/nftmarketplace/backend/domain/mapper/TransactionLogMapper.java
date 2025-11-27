package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.TransactionLog;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.TransactionLogDTO;
import org.springframework.stereotype.Component;

@Component
public class TransactionLogMapper {

    public TransactionLogDTO toDto(TransactionLog entity) {
        TransactionLogDTO dto = new TransactionLogDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        dto.setTxHash(entity.getTxHash());
        dto.setType(entity.getType() != null ? entity.getType().name() : null);
        dto.setAmount(entity.getAmount());
        dto.setTokenAddress(entity.getTokenAddress());
        dto.setRelatedId(entity.getRelatedId());
        dto.setBlockNumber(entity.getBlockNumber());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public TransactionLog toEntity(TransactionLogDTO dto, User user) {
        TransactionLog entity = new TransactionLog();
        entity.setId(dto.getId());
        entity.setUser(user);
        entity.setTxHash(dto.getTxHash());
        entity.setType(dto.getType() != null ? TransactionLog.TxType.valueOf(dto.getType()) : null);
        entity.setAmount(dto.getAmount());
        entity.setTokenAddress(dto.getTokenAddress());
        entity.setRelatedId(dto.getRelatedId());
        entity.setBlockNumber(dto.getBlockNumber());
        entity.setStatus(dto.getStatus() != null ? TransactionLog.TxStatus.valueOf(dto.getStatus()) : null);
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
