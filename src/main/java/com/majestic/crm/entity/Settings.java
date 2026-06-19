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

    @Column(nullable = false)
    @Builder.Default
    private boolean emailLeads = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailTasks = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean emailCustomers = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean taskReminders = false;

    @Column(nullable = false)
    @Builder.Default
    private boolean leadUpdates = false;

    @Column(length = 50)
@Builder.Default
    private String theme = "light";
}