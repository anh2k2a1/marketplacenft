package com.nftmarketplace.backend.domain.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Set;
import com.nftmarketplace.backend.domain.dto.RoleDTO;

@Getter
@Setter
public class UserDTO {
    private Long id;
    //sau nay add web3 vao thi them validate o field nay
    //tam thoi de field nay la co the null de test
    private String walletAddress;
    @NotBlank(message = "Username không được để trống")
    private String username;
    @Email(message = "Email không hợp lệ")
    private String email;
    private String avatarUrl;
    private String passwordHash;
    private Set<RoleDTO> roles;
    @Size(max = 255, message = "Bio tối đa 255 ký tự")
    private String bio;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

