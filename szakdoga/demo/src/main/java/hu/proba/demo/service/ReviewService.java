package hu.proba.demo.service;

import hu.proba.demo.entity.Review;
import hu.proba.demo.repository.ReviewRepository;
import hu.proba.demo.repository.UserInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;


    public Review createOrUpdateReview(Long userId, Long provisionId, Integer rating, String comment) {

        Review existingReview = reviewRepository.findByUserIdAndProvisionId(userId, provisionId);

        if (existingReview != null) {

            existingReview.setRating(rating);
            existingReview.setComment(comment);
            return reviewRepository.save(existingReview);
        } else {

            Review newReview = new Review(userId, provisionId, rating, comment);
            return reviewRepository.save(newReview);
        }
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    public Review updateReview(Long id, Integer rating, String comment) {
        Review review = reviewRepository.findById(id).orElse(null);
        if (review != null) {
            review.setRating(rating);
            review.setComment(comment);
            return reviewRepository.save(review);
        }
        return null;
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    @Autowired
    private UserInfoRepository userInfoRepository;

    public List<Review> getReviewsByProvisionId(Long provisionId) {
        List<Review> reviews = reviewRepository.findByProvisionId(provisionId);
        for (Review review : reviews) {
            userInfoRepository.findById(Math.toIntExact(review.getUserId()))
                    .ifPresent(user -> review.setUserName(user.getUname()));
        }
        return reviews;
    }

}
