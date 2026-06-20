package com.majestic.crm.service.impl;

import com.majestic.crm.dto.LeadRequest;
import com.majestic.crm.dto.LeadResponse;
import com.majestic.crm.entity.Lead;
import com.majestic.crm.entity.LeadStatus;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.LeadRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.HierarchyService;
import com.majestic.crm.service.LeadService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;
    private final HierarchyService hierarchyService;

    public LeadServiceImpl(LeadRepository leadRepository, UserRepository userRepository, HierarchyService hierarchyService) {
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
        this.hierarchyService = hierarchyService;
    }

    @Override
    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        User currentUser = getCurrentUser();
        User assignedTo = currentUser;
        if (request.getAssignedToId() != null && isAdmin()) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
        }

        Lead lead = Lead.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .source(request.getSource())
                .status(LeadStatus.valueOf(request.getStatus().toUpperCase()))
                .notes(request.getNotes())
                .budget(request.getBudget())
                .assignedTo(assignedTo)
                .company(currentUser.getCompany())
                .companyName(request.getCompanyName())
                .jobTitle(request.getJobTitle())
                .city(request.getCity())
                .state(request.getState())
                .country(request.getCountry())
                .linkedinUrl(request.getLinkedinUrl())
                .campaignName(request.getCampaignName())
                .utmMedium(request.getUtmMedium())
                .utmSource(request.getUtmSource())
                .utmCampaign(request.getUtmCampaign())
                .leadScore(request.getLeadScore() != null ? request.getLeadScore() : 0)
                .industry(request.getIndustry())
                .companySize(request.getCompanySize())
                .annualRevenue(request.getAnnualRevenue())
                .timeline(request.getTimeline())
                .painPoints(request.getPainPoints())
                .dealStage(request.getDealStage() != null ? request.getDealStage() : "PROSPECTING")
                .probability(request.getProbability() != null ? request.getProbability() : 0)
                .nextFollowUp(request.getNextFollowUp())
                .tags(request.getTags())
                .customFields(request.getCustomFields())
                .gdprConsent(request.getGdprConsent() != null ? request.getGdprConsent() : false)
                .build();

        return toResponse(leadRepository.save(lead));
    }

    @Override
    @Transactional
    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        ensureCanAccess(lead);

        User assignedTo = lead.getAssignedTo();
        if (request.getAssignedToId() != null && isAdmin()) {
            assignedTo = userRepository.findById(request.getAssignedToId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getAssignedToId()));
        }

        lead.setName(request.getName());
        lead.setEmail(request.getEmail());
        lead.setPhone(request.getPhone());
        lead.setSource(request.getSource());
        lead.setStatus(LeadStatus.valueOf(request.getStatus().toUpperCase()));
        lead.setNotes(request.getNotes());
        lead.setBudget(request.getBudget());
        lead.setAssignedTo(assignedTo);

        // Map new fields
        lead.setCompanyName(request.getCompanyName());
        lead.setJobTitle(request.getJobTitle());
        lead.setCity(request.getCity());
        lead.setState(request.getState());
        lead.setCountry(request.getCountry());
        lead.setLinkedinUrl(request.getLinkedinUrl());

        lead.setCampaignName(request.getCampaignName());
        lead.setUtmMedium(request.getUtmMedium());
        lead.setUtmSource(request.getUtmSource());
        lead.setUtmCampaign(request.getUtmCampaign());

        lead.setLeadScore(request.getLeadScore() != null ? request.getLeadScore() : lead.getLeadScore());
        lead.setIndustry(request.getIndustry());
        lead.setCompanySize(request.getCompanySize());
        lead.setAnnualRevenue(request.getAnnualRevenue());
        lead.setTimeline(request.getTimeline());
        lead.setPainPoints(request.getPainPoints());

        lead.setDealStage(request.getDealStage());
        lead.setProbability(request.getProbability() != null ? request.getProbability() : lead.getProbability());
        lead.setNextFollowUp(request.getNextFollowUp());

        lead.setTags(request.getTags());
        lead.setCustomFields(request.getCustomFields());
        if (request.getGdprConsent() != null) {
            lead.setGdprConsent(request.getGdprConsent());
        }

        return toResponse(leadRepository.save(lead));
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse getLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        ensureCanAccess(lead);
        return toResponse(lead);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadResponse> getAllLeads() {
        User currentUser = getCurrentUser();
        List<Long> visibleIds = hierarchyService.getVisibleUserIds(currentUser);
        boolean isSuperAdmin = "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        List<Lead> leads;
        if (isSuperAdmin) {
            leads = leadRepository.findAll();
        } else {
            Long companyId = currentUser.getCompany().getId();
            leads = leadRepository.findByCompanyIdAndAssignedToIdIn(companyId, visibleIds);
        }

        return leads.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        ensureCanAccess(lead);
        leadRepository.delete(lead);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    private boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && authentication.getAuthorities().stream()
                .anyMatch(authority -> "ROLE_ADMIN".equals(authority.getAuthority()));
    }

    private void ensureCanAccess(Lead lead) {
        User currentUser = getCurrentUser();
        List<Long> visibleIds = hierarchyService.getVisibleUserIds(currentUser);
        boolean isSuperAdmin = "SUPER_ADMIN".equalsIgnoreCase(currentUser.getRole().getName());
        if (isSuperAdmin) {
            return; // Super admin can access any lead
        }
        if (lead.getCompany() == null || !lead.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("You cannot access leads from another company");
        }
        if (!visibleIds.contains(lead.getAssignedTo().getId())) {
            throw new AccessDeniedException("You can access only leads within your hierarchy");
        }
    }

    private LeadResponse toResponse(Lead lead) {
        return LeadResponse.builder()
                .id(lead.getId())
                .name(lead.getName())
                .email(lead.getEmail())
                .phone(lead.getPhone())
                .source(lead.getSource())
                .status(lead.getStatus().name())
                .notes(lead.getNotes())
                .budget(lead.getBudget())
                .assignedToId(lead.getAssignedTo() != null ? lead.getAssignedTo().getId() : null)
                .assignedToName(lead.getAssignedTo() != null ? lead.getAssignedTo().getFullName() : null)
                .createdAt(lead.getCreatedAt())
                .updatedAt(lead.getUpdatedAt())
                .companyName(lead.getCompanyName())
                .jobTitle(lead.getJobTitle())
                .city(lead.getCity())
                .state(lead.getState())
                .country(lead.getCountry())
                .linkedinUrl(lead.getLinkedinUrl())
                .campaignName(lead.getCampaignName())
                .utmMedium(lead.getUtmMedium())
                .utmSource(lead.getUtmSource())
                .utmCampaign(lead.getUtmCampaign())
                .leadScore(lead.getLeadScore())
                .industry(lead.getIndustry())
                .companySize(lead.getCompanySize())
                .annualRevenue(lead.getAnnualRevenue())
                .timeline(lead.getTimeline())
                .painPoints(lead.getPainPoints())
                .dealStage(lead.getDealStage())
                .probability(lead.getProbability())
                .nextFollowUp(lead.getNextFollowUp())
                .lastContacted(lead.getLastContacted())
                .tags(lead.getTags())
                .customFields(lead.getCustomFields())
                .duplicateCheckId(lead.getDuplicateCheckId())
                .gdprConsent(lead.getGdprConsent())
                .build();
    }
}
