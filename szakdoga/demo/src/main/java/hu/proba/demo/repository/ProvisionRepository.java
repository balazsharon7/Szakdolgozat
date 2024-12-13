package hu.proba.demo.repository;

import hu.proba.demo.entity.Provision;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProvisionRepository extends JpaRepository<Provision, Long> {


    List<Provision> findByUserId(Long userId);
    @Query("SELECT p FROM Provision p WHERE " +
            "(:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))) AND " +
            "(:provider IS NULL OR LOWER(p.provider) LIKE LOWER(CONCAT('%', :provider, '%'))) AND " +
            "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
            "(:maxPrice IS NULL OR p.price <= :maxPrice)")
    List<Provision> searchProvisions(
            @Param("name") String name,
            @Param("provider") String provider,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice
    );
    @Query("SELECT COUNT(p) FROM Provision p")
    long countProvisions();

}
