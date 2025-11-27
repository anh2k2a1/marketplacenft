package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.dto.user.UserProfileDTO;
import com.nftmarketplace.backend.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserProfileResource {

    private final UserProfileService profileService;

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileDTO> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(profileService.getProfile(id));
    }
    @PutMapping("/{id}/walletAddress")
    public boolean updateWalletAddress(@RequestParam Long id, @RequestParam String walletAddress) {
        return profileService.updateOwnerAddress(id, walletAddress);
    }
    
}

