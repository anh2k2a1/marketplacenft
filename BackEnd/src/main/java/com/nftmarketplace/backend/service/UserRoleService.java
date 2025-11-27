package com.nftmarketplace.backend.service;


import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.user.UserRoleDTO;
import com.nftmarketplace.backend.domain.mapper.UserRoleMapper;
import com.nftmarketplace.backend.repository.jpa.RoleRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserRoleService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleMapper mapper;

    // Lấy danh sách role của 1 user
    public List<UserRoleDTO> getRolesByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getRoles().stream()
                .map(role -> mapper.toDto(user, role, user.getCreatedAt())) // giả sử assignedAt = createdAt
                .collect(Collectors.toList());
    }

    // Gán thêm role cho user
    public UserRoleDTO assignRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().add(role);
        userRepository.save(user);

        return mapper.toDto(user, role, LocalDateTime.now());
    }

    // Xóa role khỏi user
    public void removeRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.getRoles().remove(role);
        userRepository.save(user);
    }
}
