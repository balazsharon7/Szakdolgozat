package hu.proba.demo.service;

import hu.proba.demo.entity.Booking;
import hu.proba.demo.repository.BookingRepository;
import hu.proba.demo.repository.ProvisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;


@Service

public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ProvisionRepository provisionRepository;


    public Booking createBooking(Long userId, Long provisionId) {
        Optional<Booking> existingBooking = bookingRepository.findByUserIdAndProvisionId(userId, provisionId);
        if (existingBooking.isPresent()) {
            throw new IllegalStateException("Már lefoglaltad ezt a hirdetést.");
        }


        Long creatorUserId = provisionRepository.findById(provisionId)
                .map(provision -> provision.getUserId().longValue())
                .orElseThrow(() -> new IllegalStateException("A hirdetés nem található."));

        Booking booking = new Booking(userId, provisionId, creatorUserId, LocalDateTime.now(), "BOOKED");
        return bookingRepository.save(booking);
    }


    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }


    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByProvisionId(Long provisionId) {
        return bookingRepository.findByProvisionId(provisionId)
                .map(List::of)
                .orElseGet(List::of);
    }

    public Booking updateBooking(Long id, String status) {
        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking != null) {
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }
        return null;
    }


    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByCreatorUserId(Long creatorUserId) {
        return bookingRepository.findByCreatorUserId(creatorUserId);
    }

    public List<Object[]> getBookingsWithUsernamesByCreatorUserId(Long creatorUserId) {
        return bookingRepository.findBookingsWithUsernamesByCreatorUserId(creatorUserId);
    }


    public List<Map<String, Object>> getBookingsByProvisionIdWithUsername(Long provisionId) {
        List<Object[]> rawResults = bookingRepository.findBookingsByProvisionIdWithUsername(provisionId);

        return rawResults.stream().map(result -> {
            Map<String, Object> bookingMap = new HashMap<>();
            bookingMap.put("id", result[0]);
            bookingMap.put("userId", result[1]);
            bookingMap.put("username", result[2]);
            bookingMap.put("provisionId", result[3]);
            bookingMap.put("bookingTime", result[4]);
            bookingMap.put("status", result[5]);
            bookingMap.put("creatorUserId", result[6]); // Adj hozzá creatorUserId-t
            return bookingMap;
        }).collect(Collectors.toList());
    }
    public Booking updateBookingDate1(Long id, LocalDateTime newDate) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new IllegalStateException("Foglalás nem található."));
        booking.setBookingTime(newDate);
        return bookingRepository.save(booking);
    }

    public Booking updateBookingDate(Long id, String newDate, String status) {
        Booking booking = bookingRepository.findById(id).orElseThrow(() -> new IllegalStateException("Foglalás nem található."));

        if (status != null) {
            booking.setStatus(status);
        }

        if (newDate != null) {

            String sanitizedDate = newDate.replace("Z", "");
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSS");
            LocalDateTime parsedDate = LocalDateTime.parse(sanitizedDate, formatter);

            booking.setBookingTime(parsedDate);
        }


        return bookingRepository.save(booking);
    }
    public long countBookings() {
        return bookingRepository.countBookings();
    }

    public List<Booking> getFinalizedBookingsByUserId(Long userId) {
        return bookingRepository.findFinalizedBookingsByUserId(userId);
    }


}
