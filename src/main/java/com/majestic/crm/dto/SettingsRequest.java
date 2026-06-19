package com.majestic.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SettingsRequest {

    @NotBlank(message = "Company name is required")
    private String companyName;

    @Email(message = "Invalid email format")
    private String email;

    private String phone;
    private String address;
    private String website;

    private Boolean emailLeads;
    private Boolean emailTasks;
    private Boolean emailCustomers;
    private Boolean taskReminders;
    private Boolean leadUpdates;

    @NotBlank(message = "Theme is required")
    private String theme;
}