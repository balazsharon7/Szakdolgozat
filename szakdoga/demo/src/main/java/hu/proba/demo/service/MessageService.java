package hu.proba.demo.service;

import hu.proba.demo.entity.Message;
import hu.proba.demo.repository.MessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDateTime;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class MessageService {

    private static final Logger logger = LoggerFactory.getLogger(MessageService.class);

    @Autowired
    private MessageRepository messageRepository;

    public List<Message> getMessagesByReceiverId(Long receiverId) {
        logger.info("Fogadott üzenetek lekérése receiverId alapján: {}", receiverId);

        List<Message> messages = messageRepository.findByReceiverId(receiverId);

        logger.info("Visszaadott üzenetek receiverId alapján: {}", messages);
        return messages;
    }

    public List<Message> getMessagesBySenderId(Long senderId) {
        logger.info("Elküldött üzenetek lekérése senderId alapján: {}", senderId);

        List<Message> messages = messageRepository.findBySenderId(senderId);

        logger.info("Visszaadott üzenetek senderId alapján: {}", messages);
        return messages;
    }

    public Message sendMessage(Long senderId, Long receiverId, String content) {
        logger.info("Új üzenet létrehozása senderId={}, receiverId={}, content={}", senderId, receiverId, content);

        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        logger.info("Mentett üzenet: {}", savedMessage);
        return savedMessage;
    }
    public long countMessages() {
        return messageRepository.countMessages();
    }

}

