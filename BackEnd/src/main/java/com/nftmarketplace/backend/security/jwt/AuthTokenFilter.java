package com.nftmarketplace.backend.security.jwt;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.nftmarketplace.backend.security.Impl.UserDetailsServiceImpl;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
    throws ServletException, IOException {
    try {
      String jwt = parseJwt(request);
      logger.info("Request URI: {}, JWT token raw: '{}'", request.getRequestURI(), jwt != null ? jwt.substring(0, Math.min(20, jwt.length())) + "..." : "null");
      if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
        String email = jwtUtils.getEmailFromJwtToken(jwt);
        logger.info("JWT validated successfully, email: {}", email);

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        logger.info("UserDetails loaded: {}", userDetails);
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        logger.info("Authentication set in SecurityContext");
      } else {
        if (jwt != null) {
          logger.warn("JWT token validation failed for URI: {}", request.getRequestURI());
        } else {
          logger.info("No JWT token found for URI: {}", request.getRequestURI());
        }
      }
    } catch (Exception e) {
      logger.error("Cannot set user authentication: {}", e.getMessage(), e);
    }

    filterChain.doFilter(request, response);
  }

  private String parseJwt(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");
    logger.info("headerAuth: '{}'", headerAuth);

    if (StringUtils.hasText(headerAuth)) {
        // loại bỏ mọi "Bearer " dư thừa
        return headerAuth.replace("Bearer ", "").trim();
    }
    return null;
}

}
