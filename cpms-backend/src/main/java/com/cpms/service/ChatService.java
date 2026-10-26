package com.cpms.service;

import com.cpms.model.ChatMessage;
import com.cpms.model.ChatSession;
import com.cpms.model.User;
import com.cpms.repository.ChatMessageRepository;
import com.cpms.repository.ChatSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${gemini.api.key:}")
    private String geminiApiKey;

    public ChatService(ChatMessageRepository chatMessageRepository, ChatSessionRepository chatSessionRepository) {
        this.chatMessageRepository = chatMessageRepository;
        this.chatSessionRepository = chatSessionRepository;
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // ─── Resource links response database ───────────────────────────────────────
    private static final Map<String, String> TOPIC_RESPONSES = Map.ofEntries(
        Map.entry("react", "📚 **React.js Resources:**\n\n" +
            "🎥 YouTube: [React Full Course – freeCodeCamp](https://www.youtube.com/watch?v=bMknfKXIFA8)\n" +
            "🎥 YouTube: [React in 100 Seconds – Fireship](https://www.youtube.com/watch?v=Tn6-PIqc4UM)\n" +
            "📖 Docs: [react.dev (Official)](https://react.dev)\n" +
            "🧩 Practice: [React Challenges – Frontend Mentor](https://www.frontendmentor.io)\n\n" +
            "**Key concepts to master:** Components, Props, State, Hooks (useState, useEffect, useContext), React Router, and Axios for API calls."),

        Map.entry("java", "☕ **Java Resources:**\n\n" +
            "🎥 YouTube: [Java Tutorial for Beginners – Programming with Mosh](https://www.youtube.com/watch?v=eIrMbAQSU34)\n" +
            "🎥 YouTube: [Java Full Course – Telusko](https://www.youtube.com/watch?v=GoXwIVyNvX0)\n" +
            "📖 Docs: [Oracle Java Documentation](https://docs.oracle.com/en/java/)\n" +
            "🧩 Practice: [HackerRank Java](https://www.hackerrank.com/domains/java)\n\n" +
            "**Key topics:** OOPs, Collections, Streams, Exception Handling, Multithreading, Spring Boot."),

        Map.entry("python", "🐍 **Python Resources:**\n\n" +
            "🎥 YouTube: [Python for Beginners – Programming with Mosh](https://www.youtube.com/watch?v=kqtD5dpn9C8)\n" +
            "🎥 YouTube: [Python Full Course – freeCodeCamp](https://www.youtube.com/watch?v=rfscVS0vtbw)\n" +
            "📖 Docs: [Python Official Docs](https://docs.python.org/3/)\n" +
            "🧩 Practice: [LeetCode Python](https://leetcode.com), [Codewars](https://www.codewars.com)\n\n" +
            "**Key topics:** Data types, OOPs, File I/O, Libraries (NumPy, Pandas), Flask/Django basics."),

        Map.entry("dsa", "🧠 **DSA (Data Structures & Algorithms) Resources:**\n\n" +
            "🎥 YouTube: [DSA Full Course – Abdul Bari](https://www.youtube.com/watch?v=0IAPZzGSbME)\n" +
            "🎥 YouTube: [NeetCode 150 Roadmap](https://www.youtube.com/c/NeetCode)\n" +
            "📖 Website: [GeeksForGeeks DSA](https://www.geeksforgeeks.org/data-structures/)\n" +
            "🧩 Practice: [LeetCode](https://leetcode.com), [Codeforces](https://codeforces.com)\n\n" +
            "**Topics:** Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, DP, Sorting & Searching."),

        Map.entry("sql", "🗄️ **SQL / Database Resources:**\n\n" +
            "🎥 YouTube: [SQL Tutorial – freeCodeCamp](https://www.youtube.com/watch?v=HXV3zeQKqGY)\n" +
            "🎥 YouTube: [MySQL Full Course – Bro Code](https://www.youtube.com/watch?v=5OdVJbNCSso)\n" +
            "📖 Website: [W3Schools SQL](https://www.w3schools.com/sql/)\n" +
            "🧩 Practice: [SQLZoo](https://sqlzoo.net), [HackerRank SQL](https://www.hackerrank.com/domains/sql)\n\n" +
            "**Key topics:** SELECT, JOINs, GROUP BY, Subqueries, Indexes, Transactions, Normalization."),

        Map.entry("spring", "🍃 **Spring Boot Resources:**\n\n" +
            "🎥 YouTube: [Spring Boot Full Course – Amigoscode](https://www.youtube.com/watch?v=9SGDpanrc8U)\n" +
            "🎥 YouTube: [Spring Boot Tutorial – Daily Code Buffer](https://www.youtube.com/watch?v=35EQXmHKZYs)\n" +
            "📖 Docs: [Spring Boot Official](https://spring.io/projects/spring-boot)\n" +
            "🧩 Practice: Build REST APIs with JPA + MySQL\n\n" +
            "**Key topics:** REST APIs, JPA/Hibernate, Spring Security, JWT, Dependency Injection."),

        Map.entry("javascript", "🌐 **JavaScript Resources:**\n\n" +
            "🎥 YouTube: [JavaScript Full Course – freeCodeCamp](https://www.youtube.com/watch?v=PkZNo7MFNFg)\n" +
            "🎥 YouTube: [JavaScript in 100 Seconds – Fireship](https://www.youtube.com/watch?v=DHjqpvDnNGE)\n" +
            "📖 Docs: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript)\n" +
            "🧩 Practice: [JavaScript30](https://javascript30.com), [Exercism](https://exercism.org)\n\n" +
            "**Key topics:** ES6+, Promises, Async/Await, DOM, Fetch API, Closures, Prototypes."),

        Map.entry("node", "🟩 **Node.js Resources:**\n\n" +
            "🎥 YouTube: [Node.js Full Course – freeCodeCamp](https://www.youtube.com/watch?v=Oe421EPjeBE)\n" +
            "🎥 YouTube: [Node.js Crash Course – Traversy Media](https://www.youtube.com/watch?v=fBNz5xF-Kx4)\n" +
            "📖 Docs: [Node.js Official](https://nodejs.org/en/docs)\n\n" +
            "**Key topics:** Express.js, REST APIs, npm, File System, Streams, Event Loop."),

        Map.entry("system design", "🏗️ **System Design Resources:**\n\n" +
            "🎥 YouTube: [System Design Primer – Gaurav Sen](https://www.youtube.com/watch?v=xpDnVSmNFX0)\n" +
            "🎥 YouTube: [System Design Interview – ByteByteGo](https://www.youtube.com/c/ByteByteGo)\n" +
            "📖 GitHub: [System Design Primer](https://github.com/donnemartin/system-design-primer)\n" +
            "📖 Book: Designing Data-Intensive Applications (Martin Kleppmann)\n\n" +
            "**Key topics:** Load Balancing, Caching, Databases, Microservices, CAP theorem, Kafka."),

        Map.entry("cloud", "☁️ **Cloud & DevOps Resources:**\n\n" +
            "🎥 YouTube: [AWS for Beginners – freeCodeCamp](https://www.youtube.com/watch?v=ulprqHHWlng)\n" +
            "🎥 YouTube: [Docker Tutorial – TechWorld with Nana](https://www.youtube.com/watch?v=3c-iBn73dDE)\n" +
            "📖 Docs: [AWS Official Docs](https://docs.aws.amazon.com), [Google Cloud](https://cloud.google.com/docs)\n\n" +
            "**Key topics:** EC2, S3, RDS, Docker, Kubernetes, CI/CD pipelines.")
    );

    private static final Map<String, String[]> GENERAL_RESPONSES = Map.of(
        "interview", new String[]{
            "🎯 **Interview Preparation Tips:**\n\n" +
            "1. **Research the company** thoroughly — products, culture, recent news\n" +
            "2. **Practice STAR method** for behavioral questions (Situation, Task, Action, Result)\n" +
            "3. **Technical prep:** LeetCode daily, system design concepts\n" +
            "4. **Mock interviews:** Use [Pramp](https://www.pramp.com) or [Interviewing.io](https://interviewing.io)\n\n" +
            "🎥 [How to Crack Tech Interviews – TechLead](https://www.youtube.com/watch?v=rEJzOhC5ZtQ)",
            "💬 **Common Interview Questions to Prepare:**\n\n" +
            "• Tell me about yourself\n• Your greatest strength/weakness\n• Why do you want to work here?\n• Describe a challenging project\n• Where do you see yourself in 5 years?\n\n" +
            "🎥 [Mock Interview – Google](https://www.youtube.com/watch?v=XKu_SEDAykw)"
        },
        "resume", new String[]{
            "📄 **Resume Building Guide:**\n\n" +
            "• Keep it **1 page** for freshers\n• Use **action verbs**: Led, Built, Improved, Developed\n• **Quantify** achievements: 'Reduced load time by 40%'\n• Sections: Contact → Summary → Education → Skills → Projects → Internships\n\n" +
            "🛠 Tools: [Resume.io](https://resume.io), [Novoresume](https://novoresume.com), [OverLeaf LaTeX](https://www.overleaf.com/gallery/tagged/cv)\n\n" +
            "📖 [Google's Resume Tips](https://careers.google.com/how-we-hire/)"
        },
        "default", new String[]{
            "👋 I'm your AI Career Assistant! I can help you with:\n\n" +
            "• 📚 **Learning Resources** — Ask: 'React resources', 'Java resources', 'DSA resources'\n" +
            "• 🎯 **Interview Prep** — Tips, mock questions, STAR method\n" +
            "• 📄 **Resume Building** — Format, content, tools\n" +
            "• 🏗️ **System Design** — Ask: 'System design resources'\n" +
            "• ☁️ **Cloud/DevOps** — AWS, Docker, Kubernetes\n\n" +
            "What would you like help with today?",
            "💡 **Quick placement tips:**\n\n" +
            "1. Practice **2 LeetCode problems** daily\n2. Build **2-3 projects** to showcase on GitHub\n3. Maintain your **LinkedIn profile** actively\n4. Apply to companies **3-6 months** before graduation\n5. Attend **career fairs** and **hackathons**\n\n" +
            "Ask me about any specific technology or interview topic!"
        }
    );

    public ChatSession createSession(User user) {
        ChatSession session = new ChatSession();
        session.setUser(user);
        session.setCreatedAt(LocalDateTime.now());
        return chatSessionRepository.save(session);
    }

    public ChatMessage sendMessage(User user, Long sessionId, String content) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(sessionId, user.getId())
            .orElseThrow(() -> new RuntimeException("Chat session not found or access denied"));

        chatMessageRepository.save(
            ChatMessage.builder().session(session).user(user).role("user").content(content).build()
        );

        String response = generateResponse(content);

        return chatMessageRepository.save(
            ChatMessage.builder().session(session).user(user).role("assistant").content(response).build()
        );
    }

    private String generateResponse(String content) {
        return callGeminiApi(content);
    }

    private String callGeminiApi(String userPrompt) {
        if (geminiApiKey == null || geminiApiKey.trim().isEmpty()) {
            return generateHardcodedResponse(userPrompt.toLowerCase());
        }

        try {
            String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey;

            String instruction = "You are an AI Career Assistant integrated into the 'Campus Placement Management System' (CPMS). You help students with interview preparation, resume building, learning resources, and career advice. Be concise, friendly, and use bold text and emojis playfully. Avoid long paragraphs. Format links in markdown like [Site Name](URL) if relevant.";
            
            ObjectNode systemInstruction = objectMapper.createObjectNode();
            systemInstruction.set("parts", objectMapper.createArrayNode()
                    .add(objectMapper.createObjectNode().put("text", instruction)));
            
            var contents = objectMapper.createArrayNode()
                    .add(objectMapper.createObjectNode()
                            .set("parts", objectMapper.createArrayNode()
                                    .add(objectMapper.createObjectNode().put("text", userPrompt))));

            ObjectNode reqBodyNode = objectMapper.createObjectNode();
            reqBodyNode.set("system_instruction", systemInstruction);
            reqBodyNode.set("contents", contents);

            String reqBody = objectMapper.writeValueAsString(reqBodyNode);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(reqBody, headers);

            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode textNode = rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text");
            
            if (textNode.isMissingNode()) {
                throw new Exception("Invalid response structure from Gemini.");
            }
            
            return textNode.asText();

        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Gemini API call failed. Falling back to hardcoded responses.");
            return generateHardcodedResponse(userPrompt.toLowerCase());
        }
    }

    private String generateHardcodedResponse(String lower) {
        // Check for specific tech resource requests
        for (Map.Entry<String, String> entry : TOPIC_RESPONSES.entrySet()) {
            if (lower.contains(entry.getKey()) &&
                (lower.contains("resource") || lower.contains("learn") ||
                 lower.contains("tutorial") || lower.contains("course") ||
                 lower.contains("link") || lower.contains("study") ||
                 lower.contains("how to") || lower.contains("guide"))) {
                return entry.getValue();
            }
        }
        // Direct topic mention
        for (Map.Entry<String, String> entry : TOPIC_RESPONSES.entrySet()) {
            if (lower.contains(entry.getKey())) {
                return entry.getValue();
            }
        }
        // General topics
        if (lower.contains("interview")) {
            String[] r = GENERAL_RESPONSES.get("interview");
            return r[(int)(Math.random() * r.length)];
        }
        if (lower.contains("resume") || lower.contains("cv")) {
            String[] r = GENERAL_RESPONSES.get("resume");
            return r[(int)(Math.random() * r.length)];
        }
        String[] r = GENERAL_RESPONSES.get("default");
        return r[(int)(Math.random() * r.length)];
    }

    public void deleteSession(Long sessionId, Long userId) {
        ChatSession session = chatSessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new RuntimeException("Chat session not found or access denied"));
        
        chatMessageRepository.deleteBySessionId(sessionId);
        chatSessionRepository.delete(session);
    }

    public List<ChatMessage> getHistory(Long sessionId, Long userId) {
        chatSessionRepository.findByIdAndUserId(sessionId, userId)
            .orElseThrow(() -> new RuntimeException("Chat session not found or access denied"));
        
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
}
