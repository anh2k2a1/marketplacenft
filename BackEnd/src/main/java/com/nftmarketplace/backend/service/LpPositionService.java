package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.LiquidityPool;
import com.nftmarketplace.backend.domain.LpPosition;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.LpPositionDTO;
import com.nftmarketplace.backend.domain.mapper.LpPositionMapper;
import com.nftmarketplace.backend.repository.jpa.LiquidityPoolRepository;
import com.nftmarketplace.backend.repository.jpa.LpPositionRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LpPositionService {

    private final LpPositionRepository lpPositionRepository;
    private final UserRepository userRepository;
    private final LiquidityPoolRepository liquidityPoolRepository;
    private final LpPositionMapper mapper;

    public List<LpPositionDTO> getAll() {
        return lpPositionRepository.findAll().stream()
                .map(mapper::toDto)
                .collect(Collectors.toList());
    }

    public LpPositionDTO getById(Long id) {
        LpPosition pos = lpPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LP Position not found"));
        return mapper.toDto(pos);
    }

    public LpPositionDTO create(LpPositionDTO dto) {
        LpPosition pos = new LpPosition();

        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        LiquidityPool pool = liquidityPoolRepository.findById(dto.getPoolId())
                .orElseThrow(() -> new RuntimeException("Pool not found"));

        pos.setUser(user);
        pos.setPool(pool);
        pos.setLpTokens(dto.getLpTokens());
        pos.setAmount0Deposited(dto.getAmount0Deposited());
        pos.setAmount1Deposited(dto.getAmount1Deposited());
        pos.setSharePercent(dto.getSharePercent());
        pos.setDepositedAt(LocalDateTime.now());
        pos.setWithdrawn(false);

        return mapper.toDto(lpPositionRepository.save(pos));
    }

    public LpPositionDTO update(Long id, LpPositionDTO dto) {
        LpPosition pos = lpPositionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("LP Position not found"));

        pos.setLpTokens(dto.getLpTokens());
        pos.setAmount0Deposited(dto.getAmount0Deposited());
        pos.setAmount1Deposited(dto.getAmount1Deposited());
        pos.setSharePercent(dto.getSharePercent());
        pos.setWithdrawn(dto.getWithdrawn());

        return mapper.toDto(lpPositionRepository.save(pos));
    }

    public void delete(Long id) {
        lpPositionRepository.deleteById(id);
    }
}
