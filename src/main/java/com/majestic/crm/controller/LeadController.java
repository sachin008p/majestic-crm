package com.majestic.crm.controller;

import com.majestic.crm.dto.LeadRequest;
import com.majestic.crm.dto.LeadResponse;
import com.majestic.crm.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadService leadService;

    public LeadController(LeadService leadService) {
        this.leadService = leadService;
    }

    @PostMapping
    public ResponseEntity<LeadResponse> createLead(@Valid @RequestBody LeadRequest request) {
        return new ResponseEntity<>(leadService.createLead(request), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<LeadResponse> updateLead(@PathVariable Long id, @Valid @RequestBody LeadRequest request) {
        return ResponseEntity.ok(leadService.updateLead(id, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeadResponse> getLead(@PathVariable Long id) {
        return ResponseEntity.ok(leadService.getLead(id));
    }

    @GetMapping
    public ResponseEntity<List<LeadResponse>> getAllLeads() {
        return ResponseEntity.ok(leadService.getAllLeads());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLead(@PathVariable Long id) {
        leadService.deleteLead(id);
        return ResponseEntity.noContent().build();
    }
}
