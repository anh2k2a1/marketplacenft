package com.nftmarketplace.backend.repository.jpa;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.dto.user.ERole;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
    boolean existsByName(String name);
}
