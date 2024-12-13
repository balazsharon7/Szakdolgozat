package hu.proba.demo.service;

import hu.proba.demo.entity.Provision;
import hu.proba.demo.repository.ProvisionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProvisionService {

    @Autowired
    private ProvisionRepository provisionRepository;


    public String buildImageUrl(String filePath) {

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(filePath)
                .toUriString();
    }

    public List<Provision> getAllProvisions() {
        List<Provision> provisions = provisionRepository.findAll();
        for (Provision provision : provisions) {
            if (provision.getImageUrl() != null) {
                provision.setImageUrl(buildImageUrl(provision.getImageUrl()));
            }
        }
        return provisions;
    }



    public Provision getProvisionById(Long id) {
        return provisionRepository.findById(id).orElse(null);
    }

    public Provision createProvision(Provision provision) {
        provision.setDate(LocalDateTime.now());
        return provisionRepository.save(provision);
    }

    public Provision updateProvision(Long id, Provision provisionDetails) {
        Provision provision = provisionRepository.findById(id).orElse(null);
        if (provision != null) {
            provision.setName(provisionDetails.getName());
            provision.setDescription(provisionDetails.getDescription());
            provision.setPrice(provisionDetails.getPrice());
            provision.setDuration(provisionDetails.getDuration());
            provision.setProvider(provisionDetails.getProvider());
            provision.setDate(LocalDateTime.now());
            return provisionRepository.save(provision);
        }
        return null;
    }

    public void deleteProvision(Long id) {
        provisionRepository.deleteById(id);
    }


    public List<Provision> getUserProvisions(Long userId) {
        return provisionRepository.findByUserId(userId);
    }

    public List<Provision> searchProvisions(String name, String provider, Double minPrice, Double maxPrice) {
        return provisionRepository.searchProvisions(name, provider, minPrice, maxPrice);
    }
    public long countProvisions() {
        return provisionRepository.countProvisions();
    }

}
