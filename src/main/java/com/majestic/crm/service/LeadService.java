package com.majestic.crm.service;

import com.majestic.crm.dto.LeadRequest;
import com.majestic.crm.dto.LeadResponse;

import java.util.List;

public interface LeadService {
    LeadResponse createLead(LeadRequest request);
    LeadResponse updateLead(Long id, LeadRequest request);
    LeadResponse getLead(Long id);
    List<LeadResponse> getAllLeads();
    void deleteLead(Long id);
}
