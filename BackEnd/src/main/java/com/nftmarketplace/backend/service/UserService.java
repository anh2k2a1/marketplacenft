package com.nftmarketplace.backend.service;

import com.nftmarketplace.backend.domain.dto.RoleDTO;
import com.nftmarketplace.backend.domain.dto.user.ERole;
import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.user.RegisterDTO;
import com.nftmarketplace.backend.domain.dto.user.UserDTO;
import com.nftmarketplace.backend.domain.mapper.UserMapper;
import com.nftmarketplace.backend.repository.jpa.RoleRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor   // ✔ Tự tạo constructor inject đầy đủ
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public List<UserDTO> getAll() {
        return userRepository.findAll()
                .stream().map(userMapper::toDto).toList();
    }

    // ✅ REGISTER USER USING ENUM ROLE
    public UserDTO register(RegisterDTO dto, MultipartFile avatarFile) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Password không trùng khớp");
        }

        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        String hashedPassword = passwordEncoder.encode(dto.getPassword());

        String avatarUrl = null;
        if (avatarFile != null && !avatarFile.isEmpty()) {
            avatarUrl = saveAvatar(avatarFile);
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPasswordHash(hashedPassword);
        user.setAvatarUrl(avatarUrl);
        user.setCreatedAt(LocalDateTime.now());
        // GÁN ROLE MẶC ĐỊNH THEO ENUM
        Role defaultRole = roleRepository.findByName(ERole.ROLE_USER)
                .orElseThrow(() -> new RuntimeException("Role ROLE_USER không tồn tại"));

        user.setRoles(Set.of(defaultRole));

        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }


    // SAVE AVATAR
    private String saveAvatar(MultipartFile file) {
        try {
            String fileName = System.currentTimeMillis() + "-" + file.getOriginalFilename();
            String rootPath = "src/main/resources/static/uploads/avatar";

            File dir = new File(rootPath);
            if (!dir.exists()) {
                dir.mkdirs();
            }

            File serverFile = new File(dir.getAbsolutePath() + File.separator + fileName);
            file.transferTo(serverFile);

            return "/uploads/avatar/" + fileName;

        } catch (Exception e) {
            throw new RuntimeException("Lỗi upload avatar", e);
        }
    }
    // GET BY ID
    public UserDTO getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));

        return userMapper.toDto(user);
    }


    // UPDATE USER
    public UserDTO update(Long id, UserDTO dto) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setUsername(dto.getUsername());

        // Nếu email thay đổi → kiểm tra trùng
        if (!user.getEmail().equals(dto.getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new RuntimeException("Email đã tồn tại");
            }
            user.setEmail(dto.getEmail());
        }

        // Nếu có đổi mật khẩu
        if (dto.getPasswordHash() != null && !dto.getPasswordHash().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPasswordHash()));
        }

        // Nếu muốn chỉnh role
        if (dto.getRoles() != null && !dto.getRoles().isEmpty()) {
            Set<Role> roles = dto.getRoles().stream()
                    .map((RoleDTO r) -> roleRepository.findByName(ERole.valueOf(r.getName()))
                            .orElseThrow(() -> new RuntimeException("Không tìm thấy role: " + r.getName())))
                    .collect(java.util.stream.Collectors.toSet());

            user.setRoles(roles);
        }

        User saved = userRepository.save(user);
        return userMapper.toDto(saved);
    }


    // DELETE USER
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User không tồn tại");
        }
        userRepository.deleteById(id);
    }
}
