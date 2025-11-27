package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.dto.RoleDTO;
import com.nftmarketplace.backend.domain.dto.user.ERole;

import org.springframework.stereotype.Component;

@Component
public class RoleMapper {

    public RoleDTO toDto(Role role) {
        RoleDTO dto = new RoleDTO();
        dto.setId(role.getId());
        dto.setName(role.getName());            // name là String
        dto.setDescription(role.getDescription());
        dto.setCreatedAt(role.getCreatedAt());
        return dto;
    }

    public Role toEntity(RoleDTO dto) {
        Role role = new Role();
        role.setId(dto.getId());

        // ⭐ Chuyển String → Enum → String chính xác
        if (dto.getName() != null) {
            ERole enumRole = ERole.valueOf(dto.getName().toUpperCase());
            role.setName(enumRole);
        }

        role.setDescription(dto.getDescription());
        role.setCreatedAt(dto.getCreatedAt());
        return role;
    }
}
