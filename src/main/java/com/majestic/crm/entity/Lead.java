package com.majestic.crm.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false)
    private String name;
    
    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    private String source;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LeadStatus status;

    private String notes;

    private BigDecimal budget;

    // --- Basic Contact Info ---
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "job_title")
    private String jobTitle;

    private String city;
    private String state;
    private String country;

    @Column(name = "linkedin_url")
    private String linkedinUrl;

    // --- Lead Source & Tracking ---
    @Column(name = "campaign_name")
    private String campaignName;

    @Column(name = "utm_medium")
    private String utmMedium;

    @Column(name = "utm_source")
    private String utmSource;

    @Column(name = "utm_campaign")
    private String utmCampaign;

    // --- Qualification Data ---
    @Column(name = "lead_score")
    private Integer leadScore;

    private String industry;

    @Column(name = "company_size")
    private String companySize;

    @Column(name = "annual_revenue")
    private BigDecimal annualRevenue;

    private String timeline;
    
    @Column(name = "pain_points")
    private String painPoints;

    // --- Sales Pipeline Info ---
    @Column(name = "deal_stage")
    private String dealStage;

    private Integer probability;

    @Column(name = "next_follow_up")
    private LocalDateTime nextFollowUp;

    @Column(name = "last_contacted")
    private LocalDateTime lastContacted;

    // --- Other Metadata ---
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String tags;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "custom_fields", columnDefinition = "jsonb")
    private String customFields;

    @Column(name = "duplicate_check_id")
    private String duplicateCheckId;

    @Column(name = "gdpr_consent")
    private Boolean gdprConsent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
