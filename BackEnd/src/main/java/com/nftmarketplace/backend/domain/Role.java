package com.nftmarketplace.backend.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.nftmarketplace.backend.domain.dto.user.ERole;

@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Tên vai trò, ví dụ: "admin", "user", "creator", "moderator"
    @Enumerated(EnumType.STRING)
    @Column(unique = true, nullable = false, length = 50)
    private ERole name;

    @Column(columnDefinition = "TEXT")
    private String description;

    public Role(ERole name) {
        this.name = name;
    }

    public String getName() {
        return name.toString(); 
    }

    public void setName(ERole name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long  id) {
        this.id = id;
    }

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();
}

