package com.majestic.crm.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeadResponse {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String source;
    private String status;
    private String notes;
    private BigDecimal budget;
    private Long assignedToId;
    private String assignedToName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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
    private LocalDateTime nextFollowUp;
    private LocalDateTime lastContacted;

    // --- Other Metadata ---
    private String tags;
    private String customFields;
    private String duplicateCheckId;
    private Boolean gdprConsent;
}
