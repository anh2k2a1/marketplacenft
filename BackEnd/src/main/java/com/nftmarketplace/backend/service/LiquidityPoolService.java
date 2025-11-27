package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.LiquidityPool;
import com.nftmarketplace.backend.domain.dto.LiquidityPoolDTO;
import com.nftmarketplace.backend.domain.mapper.LiquidityPoolMapper;
import com.nftmarketplace.backend.repository.jpa.LiquidityPoolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LiquidityPoolService {

    private final LiquidityPoolRepository liquidityPoolRepository;
    private final LiquidityPoolMapper mapper;

    public List<LiquidityPoolDTO> getAll() {
        return liquidityPoolRepository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public LiquidityPoolDTO getById(Long id) {
        LiquidityPool entity = liquidityPoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Liquidity Pool not found"));
        return mapper.toDto(entity);
    }

    public LiquidityPoolDTO create(LiquidityPoolDTO dto) {
        LiquidityPool entity = mapper.toEntity(dto);
        entity.setCreatedAt(LocalDateTime.now());
        return mapper.toDto(liquidityPoolRepository.save(entity));
    }

    public LiquidityPoolDTO update(Long id, LiquidityPoolDTO dto) {
        LiquidityPool entity = liquidityPoolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Liquidity Pool not found"));

        entity.setPoolAddress(dto.getPoolAddress());
        entity.setToken0Address(dto.getToken0Address());
        entity.setToken1Address(dto.getToken1Address());
        entity.setToken0Name(dto.getToken0Name());
        entity.setToken1Name(dto.getToken1Name());
        entity.setReserve0(dto.getReserve0());
        entity.setReserve1(dto.getReserve1());
        entity.setLpTokenSupply(dto.getLpTokenSupply());
        entity.setFeeTier(dto.getFeeTier());

        return mapper.toDto(liquidityPoolRepository.save(entity));
    }

    public void delete(Long id) {
        liquidityPoolRepository.deleteById(id);
    }
}
