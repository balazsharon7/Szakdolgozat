package hu.proba.demo.controller;

import hu.proba.demo.entity.Review;
import hu.proba.demo.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;


    @PostMapping
    public ResponseEntity<Review> createOrUpdateReview(
            @RequestParam Long userId,
            @RequestParam Long provisionId,
            @RequestParam Integer rating,
            @RequestParam String comment) {
        try {
            Review review = reviewService.createOrUpdateReview(userId, provisionId, rating, comment);
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.status(400).build();
        }
    }

    @GetMapping("/provision/{provisionId}")
    public List<Review> getReviewsByProvisionId(@PathVariable Long provisionId) {
        return reviewService.getReviewsByProvisionId(provisionId);
    }

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewService.getAllReviews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        Review review = reviewService.getReviewById(id);
        if (review != null) {
            return ResponseEntity.ok(review);
        }
        return ResponseEntity.notFound().build();
    }
}
