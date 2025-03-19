package org.example.projetiard.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;

@Service
public class ObjectDetectionService {

    private final RestTemplate restTemplate;
    private final String detectionServiceUrl;

    public ObjectDetectionService(RestTemplate restTemplate,
                                  @Value("${detection.service.url:http://localhost:5000/detect}") String detectionServiceUrl) {
        this.restTemplate = restTemplate;
        this.detectionServiceUrl = detectionServiceUrl;
    }

    public List<DetectedObject> detectObjects(byte[] imageBytes) {
        try {
            // Convertir l'image en Base64
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            // Préparer la requête
            Map<String, String> request = new HashMap<>();
            request.put("image", base64Image);

            // Appeler le service de détection
            ResponseEntity<DetectionResponse> response = restTemplate.postForEntity(
                    detectionServiceUrl,
                    request,
                    DetectionResponse.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody().getObjects();
            }

        } catch (Exception e) {
            System.err.println("Erreur lors de la détection d'objets: " + e.getMessage());
            e.printStackTrace();
        }

        return Collections.emptyList();
    }

    public static class DetectionResponse {
        private List<DetectedObject> objects;

        public List<DetectedObject> getObjects() {
            return objects;
        }

        public void setObjects(List<DetectedObject> objects) {
            this.objects = objects;
        }
    }

    public static class DetectedObject {
        private String name;
        private List<Double> coordinates;
        private double confidence;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public List<Double> getCoordinates() {
            return coordinates;
        }

        public void setCoordinates(List<Double> coordinates) {
            this.coordinates = coordinates;
        }

        public double getConfidence() {
            return confidence;
        }

        public void setConfidence(double confidence) {
            this.confidence = confidence;
        }
    }
}