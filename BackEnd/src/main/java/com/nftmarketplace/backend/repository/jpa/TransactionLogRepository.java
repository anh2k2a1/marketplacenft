package com.nftmarketplace.backend.repository.jpa;

import com.nftmarketplace.backend.domain.TransactionLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionLogRepository extends JpaRepository<TransactionLog, Long> {
}
