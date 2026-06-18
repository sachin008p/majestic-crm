package com.majestic.crm.service.impl;

import com.majestic.crm.dto.TaskRequest;
import com.majestic.crm.dto.TaskResponse;
import com.majestic.crm.entity.Lead;
import com.majestic.crm.entity.Task;
import com.majestic.crm.entity.TaskStatus;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.LeadRepository;
import com.majestic.crm.repository.TaskRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.TaskService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final LeadRepository leadRepository;

    public TaskServiceImpl(TaskRepository taskRepository, UserRepository userRepository, LeadRepository leadRepository) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
    }

    @Override
    @Transactional
    public TaskResponse createTask(TaskRequest request) {
        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));

        Lead lead = null;
        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + request.getLeadId()));
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(TaskStatus.valueOf(request.getStatus().toUpperCase()))
                .priority(request.getPriority())
                .assignedTo(assignedTo)
                .lead(lead)
                .build();

        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));

        User assignedTo = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));

        Lead lead = null;
        if (request.getLeadId() != null) {
            lead = leadRepository.findById(request.getLeadId())
                    .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + request.getLeadId()));
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setStatus(TaskStatus.valueOf(request.getStatus().toUpperCase()));
        task.setPriority(request.getPriority());
        task.setAssignedTo(assignedTo);
        task.setLead(lead);

        return toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional(readOnly = true)
    public TaskResponse getTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        return toResponse(task);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found with id: " + id));
        taskRepository.delete(task);
    }

    private TaskResponse toResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .dueDate(task.getDueDate())
                .status(task.getStatus().name())
                .priority(task.getPriority())
                .assignedToId(task.getAssignedTo().getId())
                .assignedToName(task.getAssignedTo().getFullName())
                .leadId(task.getLead() != null ? task.getLead().getId() : null)
                .leadName(task.getLead() != null ? task.getLead().getName() : null)
                .createdAt(task.getCreatedAt())
                .updatedAt(task.getUpdatedAt())
                .build();
    }
}
