package hu.proba.demo.entity;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name="provisions")
@Getter
@Setter
public class Provision {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Az ID automatikus generálása
    private Integer provisionId;

    @Column(name="name")
    private String name;

    @Column(name="description")
    private String description;

    @Column(name="price")
    private Double price;

    @Column(name="duration")
    private Integer duration; // in minutes

    @Column(name = "provider")
    private String provider;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "userId", nullable = false) // Set nullable = false to enforce this rule
    private Integer userId;

    @Column(name = "image_url")
    private String imageUrl;


}

