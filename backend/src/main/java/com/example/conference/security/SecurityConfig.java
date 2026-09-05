package com.example.conference.security;

import com.example.conference.security.jwt.JwtAuthFilter;
import com.example.conference.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf->csrf.disable())
                .cors(cors-> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session-> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth->auth.requestMatchers("/user/login","/user/admin-login","/dept","/user/dept/**","/swagger-ui/**","/v3/api-docs/**","/swagger-ui.html").permitAll()
                        .requestMatchers(HttpMethod.GET, "/state").permitAll()
                        .requestMatchers("/user/me","/user/password").authenticated()
                        .requestMatchers(HttpMethod.GET, "/state/stream","/user/count/stream","/user/attendance/stream","/agenda/*","/vote/result/**","/attendance/agenda/*/user/*").authenticated()
                        .requestMatchers(HttpMethod.POST, "/vote", "/vote/cast", "/vote/cancel").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/vote").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/vote/cast").authenticated()
                        .requestMatchers("/state/**","/vote/**","/agenda/**","/attendance/**","/user/**","/dept/**","/manager/**").hasRole("ADMIN")

                        .anyRequest().authenticated())
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .addFilterBefore(
                        new JwtAuthFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173","https://momentum-sigma-rosy.vercel.app","https://conferenceapi.momentum57.cloud","https://conference.momentum57.cloud")); // Vite
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
