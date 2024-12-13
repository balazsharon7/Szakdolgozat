package hu.proba.demo.controller;

import hu.proba.demo.entity.Message;
import hu.proba.demo.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);

    @Autowired
    private MessageService messageService;

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content) {
        logger.info("Üzenet küldése: senderId={}, receiverId={}, content={}", senderId, receiverId, content);

        Message message = messageService.sendMessage(senderId, receiverId, content);

        logger.info("Üzenet sikeresen elküldve: {}", message);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/sent")
    public ResponseEntity<List<Message>> getSentMessages(@RequestParam Long senderId) {
        logger.info("Lekérdezés: elküldött üzenetek senderId={}", senderId);

        List<Message> messages = messageService.getMessagesBySenderId(senderId);

        logger.info("Elküldött üzenetek: {}", messages);
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/received")
    public ResponseEntity<List<Message>> getMessagesByReceiverId(@RequestParam Long receiverId) {
        List<Message> messages = messageService.getMessagesByReceiverId(receiverId);
        return ResponseEntity.ok(messages);
    }
    @GetMapping("/count")
    public ResponseEntity<Long> countMessages() {
        long count = messageService.countMessages();
        return ResponseEntity.ok(count);
    }



}
