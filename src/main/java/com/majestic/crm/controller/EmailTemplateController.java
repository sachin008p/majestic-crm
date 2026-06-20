package com.majestic.crm.controller;

import com.majestic.crm.dto.EmailTemplateRequest;
import com.majestic.crm.dto.EmailTemplateResponse;
import com.majestic.crm.service.EmailTemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/templates")
public class EmailTemplateController {

    private final EmailTemplateService emailTemplateService;

    public EmailTemplateController(EmailTemplateService emailTemplateService) {
        this.emailTemplateService = emailTemplateService;
    }

    @PostMapping
    public ResponseEntity<EmailTemplateResponse> createTemplate(@Valid @RequestBody EmailTemplateRequest request) {
        return new ResponseEntity<>(emailTemplateService.createTemplate(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmailTemplateResponse> updateTemplate(@PathVariable Long id, @Valid @RequestBody EmailTemplateRequest request) {
        return ResponseEntity.ok(emailTemplateService.updateTemplate(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailTemplateResponse> getTemplate(@PathVariable Long id) {
        return ResponseEntity.ok(emailTemplateService.getTemplate(id));
    }

    @GetMapping
    public ResponseEntity<List<EmailTemplateResponse>> getAllTemplates() {
        return ResponseEntity.ok(emailTemplateService.getAllTemplates());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        emailTemplateService.deleteTemplate(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<Void> sendTemplate(@PathVariable Long id, @RequestParam Long leadId) {
        emailTemplateService.sendTemplate(id, leadId);
        return ResponseEntity.ok().build();
    }
}
