package com.cpms.controller;

import com.cpms.model.ChatMessage;
import com.cpms.model.User;
import com.cpms.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/session")
    public ResponseEntity<com.cpms.model.ChatSession> createSession(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.createSession(user));
    }

    @PostMapping("/session/{sessionId}")
    public ResponseEntity<ChatMessage> sendMessage(@AuthenticationPrincipal User user,
                                                    @PathVariable Long sessionId,
                                                    @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(chatService.sendMessage(user, sessionId, body.get("content")));
    }

    @GetMapping("/session/{sessionId}/history")
    public ResponseEntity<List<ChatMessage>> getSessionHistory(@AuthenticationPrincipal User user,
                                                               @PathVariable Long sessionId) {
        return ResponseEntity.ok(chatService.getHistory(sessionId, user.getId()));
    }

    @DeleteMapping("/session/{sessionId}")
    public ResponseEntity<Void> deleteSession(@AuthenticationPrincipal User user,
                                              @PathVariable Long sessionId) {
        chatService.deleteSession(sessionId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
