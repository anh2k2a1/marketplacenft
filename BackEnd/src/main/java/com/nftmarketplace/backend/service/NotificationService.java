package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.Notification;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.NotificationDTO;
import com.nftmarketplace.backend.domain.mapper.NotificationMapper;
import com.nftmarketplace.backend.repository.jpa.NotificationRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    public NotificationDTO create(NotificationDTO dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification entity = notificationMapper.toEntity(dto, user);
        entity.setCreatedAt(LocalDateTime.now());
        return notificationMapper.toDTO(notificationRepository.save(entity));
    }

    public List<NotificationDTO> getAll() {
        return notificationRepository.findAll()
                .stream()
                .map(notificationMapper::toDTO)
                .toList();
    }

    public NotificationDTO getById(Long id) {
        return notificationRepository.findById(id)
                .map(notificationMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
    }

    public NotificationDTO update(Long id, NotificationDTO dto) {
        Notification entity = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        entity.setTitle(dto.getTitle());
        entity.setMessage(dto.getMessage());
        entity.setType(Notification.Type.valueOf(dto.getType()));
        entity.setRead(dto.getRead());

        // Nếu có đổi user
        if (dto.getUserId() != null) {
            User user = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            entity.setUser(user);
        }

        return notificationMapper.toDTO(notificationRepository.save(entity));
    }

    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }
}