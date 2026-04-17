package com.ers.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

   @Value("${jwt.secret:mydefaultsecret123456789}")
    private String secret;

    @Value("${jwt.expiration:86400000}")
    private long expiration;

    private Key key() {
        byte[] bytes = secret.getBytes();
        // Pad to at least 32 bytes for HS256
        if (bytes.length < 32) {
            byte[] padded = new byte[32];
            System.arraycopy(bytes, 0, padded, 0, bytes.length);
            return Keys.hmacShaKeyFor(padded);
        }
        return Keys.hmacShaKeyFor(bytes);
    }

    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getEmail(String token) {
        return parse(token).getSubject();
    }

    public String getRole(String token) {
        return (String) parse(token).get("role");
    }

    public boolean isValid(String token, UserDetails ud) {
        try {
            return getEmail(token).equals(ud.getUsername())
                    && !parse(token).getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims parse(String token) {
        return Jwts.parserBuilder().setSigningKey(key()).build()
                .parseClaimsJws(token).getBody();
    }
}