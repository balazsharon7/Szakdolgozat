package hu.proba.demo.controller;

import hu.proba.demo.entity.Booking;
import hu.proba.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:4200")
public class BookingController {

    @Autowired
    private BookingService bookingService;


    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestParam Long userId, @RequestParam Long provisionId) {
        if (userId == null || provisionId == null) {
            return ResponseEntity.badRequest().body("User ID vagy Provision ID hiányzik.");
        }

        try {
            Booking booking = bookingService.createBooking(userId, provisionId);
            return ResponseEntity.ok(booking);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body("Foglalás nem sikerült: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ismeretlen hiba történt.");
        }
    }


    @GetMapping("/provision/{provisionId}")
    public ResponseEntity<List<Booking>> getBookingsByProvisionId(@PathVariable Long provisionId) {
        List<Booking> bookings = bookingService.getBookingsByProvisionId(provisionId);
        if (!bookings.isEmpty()) {
            return ResponseEntity.ok(bookings);
        }
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Long userId) {
        return bookingService.getBookingsByUserId(userId);
    }




    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        if (booking != null) {
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.notFound().build();
    }


    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/creator/{creatorUserId}")
    public ResponseEntity<List<Map<String, Object>>> getBookingsWithUsernamesByCreatorUserId(@PathVariable Long creatorUserId) {
        List<Object[]> rawResults = bookingService.getBookingsWithUsernamesByCreatorUserId(creatorUserId);

        List<Map<String, Object>> results = rawResults.stream().map(result -> {
            Map<String, Object> bookingMap = new HashMap<>();
            bookingMap.put("id", result[0]);
            bookingMap.put("userId", result[1]);
            bookingMap.put("username", result[2]); // Felhasználónév
            bookingMap.put("provisionId", result[3]);
            bookingMap.put("bookingTime", result[4]);
            bookingMap.put("status", result[5]);
            return bookingMap;
        }).collect(Collectors.toList());

        if (results.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(results);
    }
    @GetMapping("/provision-with-username/{provisionId}")
    public ResponseEntity<List<Map<String, Object>>> getBookingsByProvisionIdWithUsername(@PathVariable Long provisionId) {
        List<Map<String, Object>> results = bookingService.getBookingsByProvisionIdWithUsername(provisionId);

        if (results.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(results);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countBookings() {
        long count = bookingService.countBookings();
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(
            @PathVariable Long id,
             @RequestParam String newDate ,@RequestParam(required = false) String status) {
            Booking updatedBooking = bookingService.updateBookingDate(id,newDate,status);
            if (updatedBooking != null) {
                return ResponseEntity.ok(updatedBooking);
            }
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/user/{userId}/finalized-bookings")
    public ResponseEntity<List<Booking>> getFinalizedBookingsByUserId(@PathVariable Long userId) {
        List<Booking> finalizedBookings = bookingService.getFinalizedBookingsByUserId(userId);
        return ResponseEntity.ok(finalizedBookings.isEmpty() ? Collections.emptyList() : finalizedBookings);
    }



}
