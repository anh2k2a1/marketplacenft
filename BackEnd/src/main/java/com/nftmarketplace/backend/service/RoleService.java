package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.dto.RoleDTO;
import com.nftmarketplace.backend.domain.dto.user.ERole;
import com.nftmarketplace.backend.domain.mapper.RoleMapper;
import com.nftmarketplace.backend.repository.jpa.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper = new RoleMapper();

    public List<RoleDTO> getAll() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toDto)
                .collect(Collectors.toList());
    }

    public RoleDTO getById(Long id) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        return roleMapper.toDto(role);
    }

    public RoleDTO create(RoleDTO dto) {
        Role role = roleMapper.toEntity(dto);
        role.setCreatedAt(LocalDateTime.now());
        return roleMapper.toDto(roleRepository.save(role));
    }

    public RoleDTO update(Long id, RoleDTO dto) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        role.setName(ERole.valueOf(dto.getName().toUpperCase()));
        role.setDescription(dto.getDescription());
        return roleMapper.toDto(roleRepository.save(role));
    }

    public void delete(Long id) {
        roleRepository.deleteById(id);
    }
}
