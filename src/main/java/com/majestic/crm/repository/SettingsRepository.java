package com.majestic.crm.repository;

import com.majestic.crm.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository
        extends JpaRepository<Settings, Long> {
}