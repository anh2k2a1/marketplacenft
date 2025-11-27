package com.nftmarketplace.backend.domain.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class NotificationDTO {
    private Long id;
    private String title;
    private String message;
    private String type;
    private Boolean read;
    private LocalDateTime createdAt;
    private Long userId; // test CRUD
}
