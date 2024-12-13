package hu.proba.demo.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "provision_id")
    private Long provisionId;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment")
    private String comment;

    @Transient // Nem mentjük az adatbázisba
    private String userName;

    public Review(Long userId, Long provisionId, Integer rating, String comment) {
        this.userId = userId;
        this.provisionId = provisionId;
        this.rating = rating;
        this.comment = comment;
    }

    public Review() {}
}
