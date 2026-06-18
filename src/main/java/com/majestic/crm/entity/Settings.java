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

    @Column(length = 255)
    private String companyName;

    @Column(length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 255)
    private String website;

    // FIX: Add @Column with nullable = false and defaults for Boolean fields
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean emailLeads;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean emailTasks;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean emailCustomers;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean taskReminders;

    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT false")
    private Boolean leadUpdates;

    @Column(length = 50)
    private String theme;
}