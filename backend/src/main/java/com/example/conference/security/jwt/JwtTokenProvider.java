package com.example.conference.security.jwt;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final long EXPIRATION = 1000 * 60 * 60; // 1시간

    private static final String SECRET_KEY =
            "momentum-secret-key-momentum-secret-key";
    private static final Key KEY =
            Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public String createToken(Long userId, String userName) {
        return Jwts.builder()
                .claim("userId", userId)
                .claim("userName", userName)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims parseToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(KEY)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

}
