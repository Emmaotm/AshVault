package org.example.projetiard.controller;

import org.example.projetiard.service.ObjectDetectionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Pour gérer les requêtes CORS depuis la page HTML
public class Controller {

    private final ObjectDetectionService detectionService;

    public Controller(ObjectDetectionService detectionService) {
        this.detectionService = detectionService;
    }

    @PostMapping(value = "/detect", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> detectObjectsInImage(@RequestParam("image") MultipartFile file) {
        try {
            // Vérifier que le fichier existe et est une image
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Veuillez sélectionner un fichier");
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body("Veuillez soumettre une image valide");
            }

            // Détecter les objets
            List<ObjectDetectionService.DetectedObject> detectedObjects =
                    detectionService.detectObjects(file.getBytes());

            // Préparer la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("filename", file.getOriginalFilename());
            response.put("size", file.getSize());
            response.put("contentType", file.getContentType());
            response.put("detectedObjects", detectedObjects);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Erreur lors du traitement de l'image: " + e.getMessage());
        }
    }

    @PostMapping(value = "/visualize", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> visualizeDetections(@RequestParam("image") MultipartFile file) {
        try {
            // Vérifier que le fichier existe et est une image
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().build();
            }

            // Préparer une requête pour le service Python
            RestTemplate visualizeTemplate = new RestTemplate();

            // Convertir l'image en Base64 pour l'envoyer au service Python
            String base64Image = Base64.getEncoder().encodeToString(file.getBytes());

            // Créer la requête pour le service Python
            Map<String, String> request = new HashMap<>();
            request.put("image", base64Image);

            // Appeler le service Python pour visualiser
            ResponseEntity<byte[]> response = visualizeTemplate.postForEntity(
                    "http://localhost:5000/visualize",  // URL du service Python
                    request,
                    byte[].class
            );

            // Vérifier la réponse
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                // Renvoyer l'image annotée au client
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.IMAGE_JPEG);
                return new ResponseEntity<>(response.getBody(), headers, HttpStatus.OK);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}