package com.majestic.crm.service.impl;

import com.majestic.crm.dto.CustomerRequest;
import com.majestic.crm.dto.CustomerResponse;
import com.majestic.crm.entity.Customer;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.CustomerRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.CustomerService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.majestic.crm.service.HierarchyService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;
    private final HierarchyService hierarchyService;

    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository, HierarchyService hierarchyService) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
        this.hierarchyService = hierarchyService;
    }

    @Override
    @Transactional
    public CustomerResponse createCustomer(CustomerRequest request) {
        User assignedTo = getCurrentUser();
        if (request.getAssignedToId() != null && isAdmin()) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
        }

        Customer customer = Customer.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .status(request.getStatus())
                .assignedTo(assignedTo)
                .build();
        return toResponse(customerRepository.save(customer));
    }

    @Override
    @Transactional
    public CustomerResponse updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        ensureCanAccess(customer);

        User assignedTo = customer.getAssignedTo();
        if (request.getAssignedToId() != null && isAdmin()) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
        }

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());
        customer.setStatus(request.getStatus());
        customer.setAssignedTo(assignedTo);

        return toResponse(customerRepository.save(customer));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponse getCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        ensureCanAccess(customer);
        return toResponse(customer);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        User currentUser = getCurrentUser();
        List<Long> visibleIds = hierarchyService.getVisibleUserIds(currentUser);
        boolean isSuperAdmin = "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        List<Customer> customers;
        if (isSuperAdmin) {
            customers = customerRepository.findAll();
        } else {
            Long companyId = currentUser.getCompany().getId();
            customers = customerRepository.findByCompanyIdAndAssignedToIdIn(companyId, visibleIds);
        }

        return customers.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        ensureCanAccess(customer);
        customerRepository.delete(customer);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private void ensureCanAccess(Customer customer) {
        User currentUser = getCurrentUser();
        List<Long> visibleIds = hierarchyService.getVisibleUserIds(currentUser);
        boolean isSuperAdmin = "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (isSuperAdmin) {
            return; // Super admin can access any customer
        }
        if (customer.getCompany() == null || !customer.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("You cannot access customers from another company");
        }
        if (customer.getAssignedTo() == null || !visibleIds.contains(customer.getAssignedTo().getId())) {
            throw new AccessDeniedException("You can access only customers within your hierarchy");
        }
    }

    private CustomerResponse toResponse(Customer customer) {
        return CustomerResponse.builder()
                .id(customer.getId())
                .name(customer.getName())
                .email(customer.getEmail())
                .phone(customer.getPhone())
                .address(customer.getAddress())
                .status(customer.getStatus())
                .assignedToId(customer.getAssignedTo() != null ? customer.getAssignedTo().getId() : null)
                .assignedToName(customer.getAssignedTo() != null ? customer.getAssignedTo().getFullName() : null)
                .createdAt(customer.getCreatedAt())
                .updatedAt(customer.getUpdatedAt())
                .build();
    }
}
