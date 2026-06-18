package com.majestic.crm.dto;

import lombok.Data;

@Data
public class SettingsRequest {

    private String companyName;
    private String email;
    private String phone;
    private String address;
    private String website;

    private Boolean emailLeads;
    private Boolean emailTasks;
    private Boolean emailCustomers;
    private Boolean taskReminders;
    private Boolean leadUpdates;

    private String theme;
}