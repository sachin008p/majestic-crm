package com.majestic.crm.repository;

import com.majestic.crm.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToIdIn(List<Long> userIds);
    List<Task> findByCompanyIdAndAssignedToIdIn(Long companyId, List<Long> userIds);
}
