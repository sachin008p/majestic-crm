package com.majestic.crm.service;

import com.majestic.crm.dto.SettingsRequest;
import com.majestic.crm.entity.Settings;
import com.majestic.crm.repository.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

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

        settings.setEmailLeads(request.getEmailLeads());
        settings.setEmailTasks(request.getEmailTasks());
        settings.setEmailCustomers(request.getEmailCustomers());
        settings.setTaskReminders(request.getTaskReminders());
        settings.setLeadUpdates(request.getLeadUpdates());

        settings.setTheme(request.getTheme());

        return repository.save(settings);
    }

    public Settings getSettings() {
        return repository.findAll()
                .stream()
                .findFirst()
                .orElse(null);
    }
}