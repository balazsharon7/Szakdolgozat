package hu.proba.demo.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "provision_id")
    private Long provisionId;

    @Column(name = "creator_user_id")
    private Long creatorUserId;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime;

    @Column(name = "status")
    private String status;



    public Booking(Long userId, Long provisionId, Long creatorUserId, LocalDateTime bookingTime, String status) {
        this.userId = userId;
        this.provisionId = provisionId;
        this.creatorUserId = creatorUserId;
        this.bookingTime = bookingTime;
        this.status = status;
    }

    public Booking() {}
}
