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
import com.majestic.crm.entity.Lead;
import com.majestic.crm.repository.LeadRepository;
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
    private final LeadRepository leadRepository;

    public EmailTemplateServiceImpl(EmailTemplateRepository emailTemplateRepository, UserRepository userRepository, LeadRepository leadRepository) {
        this.emailTemplateRepository = emailTemplateRepository;
        this.userRepository = userRepository;
        this.leadRepository = leadRepository;
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
        template.setCategory(request.getCategory());
        
        boolean isAdmin = currentUser.getRole().getName().equalsIgnoreCase("SUPER_ADMIN") || 
                          currentUser.getRole().getName().equalsIgnoreCase("ADMIN");
        
        if (Boolean.TRUE.equals(request.getIsShared()) && !isAdmin) {
            throw new AccessDeniedException("Only administrators can create shared templates.");
        }
        
        template.setIsShared(request.getIsShared() != null ? request.getIsShared() : false);
        template.setCreatedBy(currentUser);

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
        template.setCategory(request.getCategory());
        
        boolean isAdmin = currentUser.getRole().getName().equalsIgnoreCase("SUPER_ADMIN") || 
                          currentUser.getRole().getName().equalsIgnoreCase("ADMIN");
        
        if (Boolean.TRUE.equals(request.getIsShared()) && !isAdmin) {
            throw new AccessDeniedException("Only administrators can create shared templates.");
        }
        
        template.setIsShared(request.getIsShared() != null ? request.getIsShared() : template.getIsShared());

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

        // Non-admins can only see shared templates or their own templates
        boolean isAdmin = currentUser.getRole().getName().equalsIgnoreCase("SUPER_ADMIN") || 
                          currentUser.getRole().getName().equalsIgnoreCase("ADMIN");
                          
        return templates.stream()
                .filter(t -> isAdmin || Boolean.TRUE.equals(t.getIsShared()) || (t.getCreatedBy() != null && t.getCreatedBy().getId().equals(currentUser.getId())))
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

    @Override
    @Transactional
    public void sendTemplate(Long templateId, Long leadId) {
        EmailTemplate template = emailTemplateRepository.findById(templateId)
                .orElseThrow(() -> new ResourceNotFoundException("Template not found"));
        
        Lead lead = leadRepository.findById(leadId)
                .orElseThrow(() -> new ResourceNotFoundException("Lead not found"));

        User currentUser = getCurrentUser();
        if (!template.getCompany().getId().equals(currentUser.getCompany().getId()) || 
            !lead.getCompany().getId().equals(currentUser.getCompany().getId())) {
            throw new AccessDeniedException("Cross-company access not allowed");
        }

        // Apply merge tags
        String parsedBody = applyMergeTags(template.getBody(), lead, currentUser);
        String parsedSubject = applyMergeTags(template.getSubject(), lead, currentUser);

        // TODO: In a real environment, JavaMailSender would send this email.
        System.out.println("Sending Email to: " + lead.getEmail());
        System.out.println("Subject: " + parsedSubject);
        System.out.println("Body: \n" + parsedBody);

        // Increment analytics
        template.setSentCount(template.getSentCount() + 1);
        emailTemplateRepository.save(template);
    }

    private String applyMergeTags(String content, Lead lead, User sender) {
        if (content == null) return "";
        return content
                .replace("{{first_name}}", lead.getName() != null ? lead.getName().split(" ")[0] : "")
                .replace("{{last_name}}", lead.getName() != null && lead.getName().split(" ").length > 1 ? lead.getName().substring(lead.getName().indexOf(" ") + 1) : "")
                .replace("{{company_name}}", lead.getCompanyName() != null ? lead.getCompanyName() : "")
                .replace("{{job_title}}", lead.getJobTitle() != null ? lead.getJobTitle() : "")
                .replace("{{deal_value}}", lead.getBudget() != null ? "₹" + lead.getBudget().toString() : "")
                .replace("{{sender_name}}", sender.getFullName());
    }

    private EmailTemplateResponse mapToResponse(EmailTemplate template) {
        return EmailTemplateResponse.builder()
                .id(template.getId())
                .name(template.getName())
                .subject(template.getSubject())
                .body(template.getBody())
                .category(template.getCategory())
                .createdById(template.getCreatedBy() != null ? template.getCreatedBy().getId() : null)
                .createdByName(template.getCreatedBy() != null ? template.getCreatedBy().getFullName() : null)
                .isShared(template.getIsShared())
                .openCount(template.getOpenCount())
                .clickCount(template.getClickCount())
                .replyCount(template.getReplyCount())
                .sentCount(template.getSentCount())
                .createdAt(template.getCreatedAt())
                .updatedAt(template.getUpdatedAt())
                .build();
    }
}
