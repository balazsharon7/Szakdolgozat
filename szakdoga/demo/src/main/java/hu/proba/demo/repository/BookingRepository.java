package hu.proba.demo.repository;

import hu.proba.demo.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    Optional<Booking> findByProvisionId(Long provisionId);
    Optional<Booking> findByUserIdAndProvisionId(Long userId, Long provisionId);
    List<Booking> findByCreatorUserId(Long creatorUserId);
    @Query("SELECT b.id, b.userId, u.uname AS username, b.provisionId, b.bookingTime, b.status " +
            "FROM Booking b JOIN UserInfo u ON b.userId = u.id " +
            "WHERE b.creatorUserId = :creatorUserId")
    List<Object[]> findBookingsWithUsernamesByCreatorUserId(@Param("creatorUserId") Long creatorUserId);
    @Query("SELECT b.id, b.userId, u.uname AS username, b.provisionId, b.bookingTime, b.status, b.creatorUserId " +
            "FROM Booking b JOIN UserInfo u ON b.userId = u.id " +
            "WHERE b.provisionId = :provisionId")
    List<Object[]> findBookingsByProvisionIdWithUsername(@Param("provisionId") Long provisionId);


    @Query("SELECT COUNT(b) FROM Booking b")
    long countBookings();

    @Query("SELECT b FROM Booking b WHERE b.userId = :userId AND b.status = 'FINALIZED'")
    List<Booking> findFinalizedBookingsByUserId(@Param("userId") Long userId);


    void deleteByProvisionId(Long id);
}
