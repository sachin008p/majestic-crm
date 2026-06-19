package com.majestic.crm.service.impl;

import com.majestic.crm.entity.User;
import com.majestic.crm.repository.UserRepository;
import com.majestic.crm.service.HierarchyService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HierarchyServiceImpl implements HierarchyService {

    private final UserRepository userRepository;

    public HierarchyServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Returns a list of user IDs that the current user can view.
     * Includes the current user's own ID and IDs of all direct/indirect reports.
     */
    @Override
    public List<Long> getVisibleUserIds(User currentUser) {
        List<Long> ids = new ArrayList<>();
        ids.add(currentUser.getId());
        collectSubordinates(currentUser, ids);
        return ids;
    }

    private void collectSubordinates(User manager, List<Long> ids) {
        List<User> directReports = userRepository.findByReportingTo(manager);
        if (directReports == null) return;
        for (User u : directReports) {
            ids.add(u.getId());
            // Recursively collect lower level reports
            collectSubordinates(u, ids);
        }
    }
}
