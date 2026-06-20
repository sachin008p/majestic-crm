package com.majestic.crm.service.impl;

import com.majestic.crm.dto.AdminUserCreateRequest;
import com.majestic.crm.dto.UserResponseDto;
import com.majestic.crm.dto.UserUpdateRequest;
import com.majestic.crm.entity.Company;
import com.majestic.crm.entity.Role;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.RoleRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        User currentUser = getCurrentUser();
        Company company = currentUser.getCompany();
        
        List<User> users;
        if ("SUPER_ADMIN".equals(currentUser.getRole().getName())) {
            users = userRepository.findAll();
        } else {
            // Find all users in the same company
            users = userRepository.findAll().stream()
                    .filter(u -> u.getCompany() != null && u.getCompany().getId().equals(company.getId()))
                    .collect(Collectors.toList());
        }

        return users.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto createUser(AdminUserCreateRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        User currentUser = getCurrentUser();
        Company company = currentUser.getCompany();

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name " + request.getRoleName()));

        User reportingTo = null;
        if (request.getReportingToId() != null) {
            reportingTo = userRepository.findById(request.getReportingToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id " + request.getReportingToId()));
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .company(company)
                .reportingTo(reportingTo)
                .isActive(request.getIsActive())
                .mustChangePassword(false)
                .build();

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDto updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));

        // Check if email is changing and if it's already taken
        if (!user.getEmail().equals(request.getEmail()) && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists: " + request.getEmail());
        }

        Role role = roleRepository.findByName(request.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name " + request.getRoleName()));

        User reportingTo = null;
        if (request.getReportingToId() != null) {
            if (request.getReportingToId().equals(id)) {
                throw new IllegalArgumentException("User cannot report to themselves.");
            }
            reportingTo = userRepository.findById(request.getReportingToId())
                    .orElseThrow(() -> new ResourceNotFoundException("Manager not found with id " + request.getReportingToId()));
            
            // Basic circular dependency check (1 level deep)
            if (reportingTo.getReportingTo() != null && reportingTo.getReportingTo().getId().equals(user.getId())) {
                throw new IllegalArgumentException("Circular hierarchy detected.");
            }
        }

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setRole(role);
        user.setActive(request.getIsActive());
        user.setReportingTo(reportingTo);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id " + id));
        userRepository.delete(user);
    }

    private UserResponseDto mapToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .isActive(user.isActive())
                .reportingToId(user.getReportingTo() != null ? user.getReportingTo().getId() : null)
                .reportingToName(user.getReportingTo() != null ? user.getReportingTo().getFullName() : null)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
