package com.majestic.crm.service;
import com.majestic.crm.dto.AuthRequest;
import com.majestic.crm.dto.AuthResponse;
import com.majestic.crm.dto.RegisterRequest;
import com.majestic.crm.dto.UserSummary;
public interface AuthService {
    AuthResponse login(AuthRequest request);
    UserSummary register(RegisterRequest request);
    void changePassword(String email, String currentPassword, String newPassword);
}