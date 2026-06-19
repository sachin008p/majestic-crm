package com.majestic.crm.repository;

import com.majestic.crm.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeadRepository extends JpaRepository<Lead, Long> {
    List<Lead> findByAssignedToIdIn(List<Long> userIds);
    List<Lead> findByCompanyIdAndAssignedToIdIn(Long companyId, List<Long> userIds);
}
