package com.majestic.crm.service.impl;

import com.majestic.crm.dto.EmailTemplateRequest;
import com.majestic.crm.dto.EmailTemplateResponse;
import com.majestic.crm.entity.Company;
import com.majestic.crm.entity.EmailTemplate;
import com.majestic.crm.entity.User;
import com.majestic.crm.exception.ResourceNotFoundException;
import com.majestic.crm.repository.EmailTemplateRepository;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.EmailTemplateService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EmailTemplateServiceImpl implements EmailTemplateService {

    private final EmailTemplateRepository emailTemplateRepository;
    private final UserRepository userRepository;

    public EmailTemplateServiceImpl(EmailTemplateRepository emailTemplateRepository, UserRepository userRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new AccessDeniedException("Authentication required");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    @Override
    @Transactional
    public EmailTemplateResponse createTemplate(EmailTemplateRequest request) {
        User currentUser = getCurrentUser();
        Company company = currentUser.getCompany();

        EmailTemplate template = new EmailTemplate();
        template.setName(request.getName());
        template.setSubject(request.getSubject());
        template.setBody(request.getBody());
        template.setCompany(company);

        return mapToResponse(emailTemplateRepository.save(template));
    }

    @Override
    @Transactional
    public EmailTemplateResponse updateTemplate(Long id, EmailTemplateRequest request) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id " + id));

        User currentUser = getCurrentUser();
        if (!template.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("You cannot edit templates of another company");
        }

        template.setName(request.getName());
        template.setSubject(request.getSubject());
        template.setBody(request.getBody());

        return mapToResponse(emailTemplateRepository.save(template));
    }

    @Override
    @Transactional(readOnly = true)
    public EmailTemplateResponse getTemplate(Long id) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id " + id));

        User currentUser = getCurrentUser();
        if (!template.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("You cannot view templates of another company");
        }

        return mapToResponse(template);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EmailTemplateResponse> getAllTemplates() {
        User currentUser = getCurrentUser();
        List<EmailTemplate> templates = emailTemplateRepository.findByCompanyId(currentUser.getCompany().getId());

        return templates.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteTemplate(Long id) {
        EmailTemplate template = emailTemplateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found with id " + id));

        User currentUser = getCurrentUser();
        if (!template.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("You cannot delete templates of another company");
        }

        emailTemplateRepository.delete(template);
    }

    private EmailTemplateResponse mapToResponse(EmailTemplate template) {
        return EmailTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .subject(template.getSubject())
                .body(template.getBody())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}
