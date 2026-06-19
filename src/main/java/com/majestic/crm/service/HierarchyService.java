package com.majestic.crm.service;

import com.majestic.crm.entity.User;
import java.util.List;

/**
 * Service that provides utilities for hierarchical access control.
 * It computes the set of user IDs that the {@code currentUser} is allowed to see.
 */
public interface HierarchyService {
    /**
     * Returns a list of user IDs that the given user can view.
     * The list always includes the user itself.
     */
    List<Long> getVisibleUserIds(User currentUser);
}
