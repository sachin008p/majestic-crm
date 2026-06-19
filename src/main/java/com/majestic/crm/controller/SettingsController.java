package com.majestic.crm.controller;

import com.majestic.crm.dto.SettingsRequest;
import com.majestic.crm.entity.Settings;
import com.majestic.crm.service.SettingsService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private static final Logger log = LoggerFactory.getLogger(SettingsController.class);

    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        log.info("GET /api/settings");

        Settings settings = service.getSettings();

        log.info("Settings loaded successfully");
        return ResponseEntity.ok(settings);
    }

    @PostMapping
    public ResponseEntity<Settings> save(@Valid @RequestBody SettingsRequest request) {

        log.info("POST /api/settings - companyName={}", request.getCompanyName());

        Settings savedSettings = service.save(request);

        log.info("Settings saved successfully - id={}", savedSettings.getId());

        return ResponseEntity.ok(savedSettings);
    }
}