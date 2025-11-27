package com.nftmarketplace.backend.web.rest;

import com.nftmarketplace.backend.domain.Role;
import com.nftmarketplace.backend.domain.User;
import com.nftmarketplace.backend.domain.dto.user.ERole;
import com.nftmarketplace.backend.domain.dto.user.RegisterDTO;
import com.nftmarketplace.backend.domain.dto.user.UserDTO;
import com.nftmarketplace.backend.repository.jpa.RoleRepository;
import com.nftmarketplace.backend.repository.jpa.UserRepository;
import com.nftmarketplace.backend.security.Impl.UserDetailsImpl;
import com.nftmarketplace.backend.security.jwt.JwtUtils;
import com.nftmarketplace.backend.service.UserService;
import com.nftmarketplace.backend.service.request.LoginRequest;
import com.nftmarketplace.backend.service.request.SignupRequest;
import com.nftmarketplace.backend.service.response.JwtResponse;
import com.nftmarketplace.backend.service.response.MessageResponse;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthResource {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    // ------------------- LOGIN -------------------
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                roles));
    }

    // ------------------- REGISTER -------------------
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Tên người dùng đã được sử dụng!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Email đã được sử dụng!"));
        }

        if (userRepository.existsByWalletAddress(signUpRequest.getWalletAddress())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: Địa chỉ ví đã được đăng ký!"));
        }

        // Tạo mới user
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setWalletAddress(signUpRequest.getWalletAddress());
        user.setPasswordHash(encoder.encode(signUpRequest.getPasswordHash()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò ROLE"));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò ROLE_ADMIN"));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository.findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò ROLE_MODERATOR."));
                        roles.add(modRole);

                        break;
                    case "creator":
                        Role creator = roleRepository.findByName(ERole.ROLE_CREATOR)
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò CREATOR."));
                        roles.add(creator);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy vai trò ROLE_USER."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        userRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("Đăng ký thành công!"));
    }
}
