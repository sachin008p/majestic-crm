package com.majestic.crm.service;

import com.majestic.crm.dto.CustomerRequest;
import com.majestic.crm.dto.CustomerResponse;

import java.util.List;

public interface CustomerService {
    CustomerResponse createCustomer(CustomerRequest request);
    CustomerResponse updateCustomer(Long id, CustomerRequest request);
    CustomerResponse getCustomer(Long id);
    List<CustomerResponse> getAllCustomers();
    void deleteCustomer(Long id);
}
