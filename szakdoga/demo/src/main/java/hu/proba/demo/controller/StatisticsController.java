package hu.proba.demo.controller;

import hu.proba.demo.service.BookingService;
import hu.proba.demo.service.MessageService;
import hu.proba.demo.service.ProvisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "http://localhost:4200")
public class StatisticsController {

    @Autowired
    private ProvisionService provisionService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private MessageService messageService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalProvisions", provisionService.countProvisions());
        stats.put("totalBookings", bookingService.countBookings());
        stats.put("totalMessages", messageService.countMessages());
        return ResponseEntity.ok(stats);
    }
}
