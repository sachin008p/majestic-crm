package com.majestic.crm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadRequest {
    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone is required")
    private String phone;

    private String source;

    @NotBlank(message = "Status is required")
    private String status;

    private String notes;

    private BigDecimal budget;

    private Long assignedToId;

    // --- Basic Contact Info ---
    private String companyName;
    private String jobTitle;
    private String city;
    private String state;
    private String country;
    private String linkedinUrl;

    // --- Lead Source & Tracking ---
    private String campaignName;
    private String utmMedium;
    private String utmSource;
    private String utmCampaign;

    // --- Qualification Data ---
    private Integer leadScore;
    private String industry;
    private String companySize;
    private BigDecimal annualRevenue;
    private String timeline;
    private String painPoints;

    // --- Sales Pipeline Info ---
    private String dealStage;
    private Integer probability;
    private java.time.LocalDateTime nextFollowUp;

    // --- Other Metadata ---
    private String tags; // Stored as JSON string
    private String customFields; // Stored as JSON string
    private Boolean gdprConsent;
}
