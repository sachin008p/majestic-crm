package com.majestic.crm.controller;
import com.majestic.crm.dto.AuthRequest;
import com.majestic.crm.dto.AuthResponse;
import com.majestic.crm.dto.RegisterRequest;
import com.majestic.crm.dto.UserSummary;
import com.majestic.crm.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/register")
    public ResponseEntity<UserSummary> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(authService.register(request), HttpStatus.CREATED);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserDetails userDetails) {
        authService.changePassword(
                userDetails.getUsername(),
                request.get("currentPassword"),
                request.get("newPassword")
        );
        return ResponseEntity.ok().build();
    }
}