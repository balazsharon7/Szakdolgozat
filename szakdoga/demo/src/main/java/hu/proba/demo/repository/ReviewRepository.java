package hu.proba.demo.repository;

import hu.proba.demo.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
     List<Review> findByProvisionId(Long provisionId);
     Review findByUserIdAndProvisionId(Long userId, Long provisionId);

}
