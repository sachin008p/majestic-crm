package com.majestic.crm.service;

import com.majestic.crm.dto.SettingsRequest;
import com.majestic.crm.entity.Settings;
import com.majestic.crm.repository.SettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public Settings save(SettingsRequest request) {

        Settings settings;

        if(repository.count() > 0) {
            settings = repository.findAll().get(0);
        } else {
            settings = new Settings();
        }

        settings.setCompanyName(request.getCompanyName());
        settings.setEmail(request.getEmail());
        settings.setPhone(request.getPhone());
        settings.setAddress(request.getAddress());
        settings.setWebsite(request.getWebsite());

        settings.setEmailLeads(Boolean.TRUE.equals(request.getEmailLeads()));
        settings.setEmailTasks(Boolean.TRUE.equals(request.getEmailTasks()));
        settings.setEmailCustomers(Boolean.TRUE.equals(request.getEmailCustomers()));
        settings.setTaskReminders(Boolean.TRUE.equals(request.getTaskReminders()));
        settings.setLeadUpdates(Boolean.TRUE.equals(request.getLeadUpdates()));

        settings.setTheme("dark".equals(request.getTheme()) ? "dark" : "light");

        return repository.save(settings);
    }

    @Transactional(readOnly = true)
    public Settings getSettings() {
        return repository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}
