package com.server.controller;

import com.server.model.User;
import com.server.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:8000")
public class AuthController {
    private final UserRepository userRepository;
    // Simple in-memory session store: token -> userId
    private static final Map<String, Long> sessions = new ConcurrentHashMap<>();

    @Autowired
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password required");
        }
        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        User user = new User(username, password); // In production, hash the password!
        userRepository.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        String password = req.get("password");
        if (username == null || password == null) {
            return ResponseEntity.badRequest().body("Username and password required");
        }
        User user = userRepository.findByUsername(username);
        if (user == null || !user.getPassword().equals(password)) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
        String token = UUID.randomUUID().toString();
        sessions.put(token, user.getId());
        return ResponseEntity.ok(Map.of("token", token));
    }

    // Utility for other controllers to get userId from token
    public static Long getUserIdFromToken(String token) {
        return sessions.get(token);
    }
} 