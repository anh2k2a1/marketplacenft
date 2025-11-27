package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.user.UserRoleDTO;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UserRoleMapper {
    public UserRoleDTO toDto(User user, Role role, LocalDateTime assignedAt) {
        UserRoleDTO dto = new UserRoleDTO();
        dto.setUserId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setRoleId(role.getId());
        dto.setRoleName(role.getName());
        dto.setAssignedAt(assignedAt);
        return dto;
    }
}
