package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.LpPosition;
import com.nftmarketplace.backend.domain.dto.LpPositionDTO;
import org.springframework.stereotype.Component;

@Component
public class LpPositionMapper {

    public LpPositionDTO toDto(LpPosition entity) {
        LpPositionDTO dto = new LpPositionDTO();
        dto.setId(entity.getId());
        dto.setLpTokens(entity.getLpTokens());
        dto.setAmount0Deposited(entity.getAmount0Deposited());
        dto.setAmount1Deposited(entity.getAmount1Deposited());
        dto.setSharePercent(entity.getSharePercent());
        dto.setDepositedAt(entity.getDepositedAt());
        dto.setWithdrawn(entity.getWithdrawn());

        if (entity.getUser() != null) {
            dto.setUserId(entity.getUser().getId());
            dto.setUsername(entity.getUser().getUsername());
        }

        if (entity.getPool() != null) {
            dto.setPoolId(entity.getPool().getId());
            dto.setPoolAddress(entity.getPool().getPoolAddress());
        }

        return dto;
    }
}
