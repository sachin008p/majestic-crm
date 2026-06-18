package com.majestic.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime dueDate;
    private String status;
    private String priority;
    private Long assignedToId;
    private String assignedToName;
    private Long leadId;
    private String leadName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
