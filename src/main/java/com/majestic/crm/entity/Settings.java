package com.majestic.crm.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "settings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

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