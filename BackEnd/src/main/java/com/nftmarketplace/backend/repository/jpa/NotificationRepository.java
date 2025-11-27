package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
