package com.project.management.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.project.management.model.Discussion;

public interface DiscussionRepository extends MongoRepository<Discussion, String> {
    // ✅ Fetch all messages for a workspace, sorted by timestamp
    List<Discussion> findByWorkspaceIdOrderByTimestampAsc(String workspaceId);
}
