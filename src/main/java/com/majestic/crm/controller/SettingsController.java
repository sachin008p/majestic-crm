package com.majestic.crm.controller;

import com.majestic.crm.dto.SettingsRequest;
import com.majestic.crm.entity.Settings;
import com.majestic.crm.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin("*")
public class SettingsController {

    private final SettingsService service;

    public SettingsController(SettingsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Settings> getSettings() {
        return ResponseEntity.ok(
                service.getSettings()
        );
    }

    @PostMapping
    public ResponseEntity<Settings> save(
            @RequestBody SettingsRequest request
    ) {
        return ResponseEntity.ok(
                service.save(request)
        );
    }
}