package com.majestic.crm.service;

import com.majestic.crm.dto.TaskRequest;
import com.majestic.crm.dto.TaskResponse;

import java.util.List;

public interface TaskService {
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(Long id, TaskRequest request);
    TaskResponse getTask(Long id);
    List<TaskResponse> getAllTasks();
    void deleteTask(Long id);
}
