package com.majestic.crm.repository;

import com.majestic.crm.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {
    List<Customer> findByAssignedToId(Long userId);
    List<Customer> findByCompanyIdAndAssignedToIdIn(Long companyId, List<Long> userIds);
}
