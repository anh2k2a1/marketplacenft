package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.LiquidityPool;
import com.nftmarketplace.backend.domain.dto.LiquidityPoolDTO;
import org.springframework.stereotype.Component;

@Component
public class LiquidityPoolMapper {

    public LiquidityPoolDTO toDto(LiquidityPool entity) {
        LiquidityPoolDTO dto = new LiquidityPoolDTO();
        dto.setId(entity.getId());
        dto.setPoolAddress(entity.getPoolAddress());
        dto.setToken0Address(entity.getToken0Address());
        dto.setToken1Address(entity.getToken1Address());
        dto.setToken0Name(entity.getToken0Name());
        dto.setToken1Name(entity.getToken1Name());
        dto.setReserve0(entity.getReserve0());
        dto.setReserve1(entity.getReserve1());
        dto.setLpTokenSupply(entity.getLpTokenSupply());
        dto.setFeeTier(entity.getFeeTier());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    public LiquidityPool toEntity(LiquidityPoolDTO dto) {
        LiquidityPool entity = new LiquidityPool();
        entity.setId(dto.getId());
        entity.setPoolAddress(dto.getPoolAddress());
        entity.setToken0Address(dto.getToken0Address());
        entity.setToken1Address(dto.getToken1Address());
        entity.setToken0Name(dto.getToken0Name());
        entity.setToken1Name(dto.getToken1Name());
        entity.setReserve0(dto.getReserve0());
        entity.setReserve1(dto.getReserve1());
        entity.setLpTokenSupply(dto.getLpTokenSupply());
        entity.setFeeTier(dto.getFeeTier());
        entity.setCreatedAt(dto.getCreatedAt());
        return entity;
    }
}
