package hu.proba.demo.controller;

import hu.proba.demo.entity.Provision;
import hu.proba.demo.service.ProvisionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/provisions")
@CrossOrigin(origins = "http://localhost:4200")
public class ProvisionController {

    @Autowired
    private ProvisionService provisionService;


    @GetMapping
    public List<Provision> getAllProvisions() {
        return provisionService.getAllProvisions();
    }

    public String getFullImageUrl(String imagePath) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/")
                .path(imagePath)
                .toUriString();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Provision> getProvisionById(@PathVariable Long id) {
        Provision provision = provisionService.getProvisionById(id);

        if (provision == null) {
            return ResponseEntity.notFound().build();
        }


        if (provision.getImageUrl() != null) {
            provision.setImageUrl(getFullImageUrl(provision.getImageUrl()));
        }

        return ResponseEntity.ok(provision);
    }



    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Provision> createProvision(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") double price,
            @RequestParam("duration") int duration,
            @RequestParam("provider") String provider,
            @RequestParam("userId") int userId,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            Provision provision = new Provision();
            provision.setName(name);
            provision.setDescription(description);
            provision.setPrice(price);
            provision.setDuration(duration);
            provision.setProvider(provider);
            provision.setUserId(userId);
            provision.setDate(LocalDateTime.now());

            if (image != null && !image.isEmpty()) {
                String fileName = saveImage(image);
                provision.setImageUrl(fileName);
            }

            Provision createdProvision = provisionService.createProvision(provision);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProvision);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<Provision> updateProvision(@PathVariable Long id, @RequestBody Provision provisionDetails) {
        Provision updatedProvision = provisionService.updateProvision(id, provisionDetails);
        if (updatedProvision != null) {
            return ResponseEntity.ok(updatedProvision);
        }
        return ResponseEntity.notFound().build();
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProvision(@PathVariable Long id) {
        provisionService.deleteProvision(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/my-provisions")
    public ResponseEntity<List<Provision>> getUserProvisions(@RequestParam Long userId) {
        List<Provision> userProvisions = provisionService.getUserProvisions(userId);
        if (userProvisions.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // Nincs hirdetés
        }
        return ResponseEntity.ok(userProvisions);
    }


    @GetMapping("/search")
    public List<Provision> searchProvisions(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String provider,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice) {
        return provisionService.searchProvisions(name, provider, minPrice, maxPrice);
    }

    private String saveImage(MultipartFile image) throws IOException {
        String uploadsDir = "uploads/";
        String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename().replace(" ", "_");
        Path filePath = Paths.get(uploadsDir, fileName);

        Files.createDirectories(filePath.getParent());
        Files.copy(image.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileName;
    }
    @GetMapping("/count")
    public ResponseEntity<Long> countProvisions() {
        long count = provisionService.countProvisions();
        return ResponseEntity.ok(count);
    }




}
