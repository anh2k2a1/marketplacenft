package com.nftmarketplace.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.nftmarketplace.backend.domain.dto.user.ERole;
import com.nftmarketplace.backend.repository.jpa.RoleRepository;
import com.nftmarketplace.backend.domain.Role;

@SpringBootApplication
public class NftMarketplaceBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(NftMarketplaceBackendApplication.class, args);
	}

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(ERole.ROLE_USER));
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
                roleRepository.save(new Role(ERole.ROLE_MODERATOR));
                roleRepository.save(new Role(ERole.ROLE_CREATOR));
                System.out.println("Đã chèn thành công các vai trò mặc định!");
            } else {
                System.out.println("Các vai trò đã tồn tại — bỏ qua bước khởi tạo.");
            }
        };

}
}
