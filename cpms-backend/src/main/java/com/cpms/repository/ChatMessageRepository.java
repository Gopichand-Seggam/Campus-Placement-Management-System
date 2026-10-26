package com.cpms.repository;

import com.cpms.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySessionIdOrderByTimestampAsc(Long sessionId);
    void deleteBySessionId(Long sessionId);
}
