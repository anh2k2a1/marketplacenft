package com.nftmarketplace.backend.domain.dto.user;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
public class UserRoleDTO {
    private Long userId;
    private String username;
    private Long roleId;
    private String roleName;
    private LocalDateTime assignedAt;
}
