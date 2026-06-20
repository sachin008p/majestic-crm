package com.majestic.crm.service;

import com.majestic.crm.dto.EmailTemplateRequest;
import com.majestic.crm.dto.EmailTemplateResponse;

import java.util.List;

public interface EmailTemplateService {
    EmailTemplateResponse createTemplate(EmailTemplateRequest request);
    EmailTemplateResponse updateTemplate(Long id, EmailTemplateRequest request);
    EmailTemplateResponse getTemplate(Long id);
    List<EmailTemplateResponse> getAllTemplates();
    void deleteTemplate(Long id);
    
    // Sends the template (simulated) to a given lead
    void sendTemplate(Long templateId, Long leadId);
}
