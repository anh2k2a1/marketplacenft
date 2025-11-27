package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.user.UserRoleDTO;
import com.nftmarketplace.backend.service.UserRoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-roles")
@RequiredArgsConstructor
public class UserRoleResource {

    private final UserRoleService userRoleService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<UserRoleDTO>> getRolesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(userRoleService.getRolesByUserId(userId));
    }

    @PostMapping("/assign")
    public ResponseEntity<UserRoleDTO> assignRole(@RequestParam Long userId, @RequestParam Long roleId) {
        return ResponseEntity.ok(userRoleService.assignRole(userId, roleId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Void> removeRole(@RequestParam Long userId, @RequestParam Long roleId) {
        userRoleService.removeRole(userId, roleId);
        return ResponseEntity.noContent().build();
    }
}
