package com.majestic.crm.service;

import com.majestic.crm.dto.AdminUserCreateRequest;
import com.majestic.crm.dto.UserResponseDto;
import com.majestic.crm.dto.UserUpdateRequest;

import java.util.List;

public interface UserService {
    List<UserResponseDto> getAllUsers();
    UserResponseDto getUserById(Long id);
    UserResponseDto createUser(AdminUserCreateRequest request);
    UserResponseDto updateUser(Long id, UserUpdateRequest request);
    void deleteUser(Long id);
}
