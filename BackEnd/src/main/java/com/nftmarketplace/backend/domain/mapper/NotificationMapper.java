package com.nftmarketplace.backend.domain.mapper;

import com.nftmarketplace.backend.domain.Notification;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.NotificationDTO;
import org.springframework.stereotype.Component;

@Component
public class NotificationMapper {
    public  NotificationDTO toDTO(Notification entity) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setMessage(entity.getMessage());
        dto.setType(entity.getType().name());
        dto.setRead(entity.getRead());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUserId(entity.getUser() != null ? entity.getUser().getId() : null);
        return dto;
    }

    public  Notification toEntity(NotificationDTO dto, User user) {
        Notification entity = new Notification();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setMessage(dto.getMessage());
        entity.setType(Notification.Type.valueOf(dto.getType()));
        entity.setRead(dto.getRead());
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUser(user);
        return entity;
    }
}
