package com.nftmarketplace.backend.config;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class EnvConfig {

    @Bean
   public Dotenv dotenv() {
    Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    // Set biến vào System Environment
    System.setProperty("GOOGLE_CLIENT_ID", dotenv.get("GOOGLE_CLIENT_ID"));
    System.setProperty("GOOGLE_CLIENT_SECRET", dotenv.get("GOOGLE_CLIENT_SECRET"));

    return dotenv;
}
}