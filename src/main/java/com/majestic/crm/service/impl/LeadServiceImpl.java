package com.majestic.crm.service.impl;

import com.majestic.crm.dto.LeadRequest;
import com.majestic.crm.dto.LeadResponse;
import com.majestic.crm.entity.Lead;
import com.majestic.crm.entity.LeadStatus;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.LeadRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.LeadService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeadServiceImpl implements LeadService {

    private final LeadRepository leadRepository;
    private final UserRepository userRepository;

    public LeadServiceImpl(LeadRepository leadRepository, UserRepository userRepository) {
        this.leadRepository = leadRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public LeadResponse createLead(LeadRequest request) {
        User assignedTo = null;
        if (request.getAssignedToId() != null) {
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
                .build();

        return toResponse(leadRepository.save(lead));
    }

    @Override
    @Transactional
    public LeadResponse updateLead(Long id, LeadRequest request) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));

        User assignedTo = null;
        if (request.getAssignedToId() != null) {
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

        return toResponse(leadRepository.save(lead));
    }

    @Override
    @Transactional(readOnly = true)
    public LeadResponse getLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        return toResponse(lead);
    }

    @Override
    @Transactional(readOnly = true)
    public List<LeadResponse> getAllLeads() {
        return leadRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteLead(Long id) {
        Lead lead = leadRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found with id: " + id));
        leadRepository.delete(lead);
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
                .build();
    }
}
