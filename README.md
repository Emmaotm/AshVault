# Projet Inventaire Photo pour Assurance IARD

## Description
Application web permettant aux assurés de documenter régulièrement leur intérieur par photos pour faciliter l'indemnisation en cas de sinistre majeur. Le système identifie et évalue automatiquement les objets visibles sur les photos grâce à une intelligence artificielle.

## Fonctionnalités principales
- Upload de photos par pièce de la propriété
- Identification automatique des objets visibles via YOLO
- Estimation de la valeur des objets détectés
- Génération d'un rapport d'inventaire valorisé

## Architecture technique
- **Frontend** : React.js
- **Backend** : Java Spring Boot
- **API REST** : Communication entre le frontend et les services de détection
- **Service de détection d'objets** : Service Python avec Flask et Ultralytics YOLO
- **Service de visualisation** : Service Python pour générer les images annotées

## Structure du projet

### Backend (Java Spring Boot)

```
org.example.projetiard
├── ProjetIardApplication.java    // Point d'entrée de l'application
├── controller
│   └── Controller.java          // Contrôleur REST pour les endpoints API
└── service
    └── ObjectDetectionService.java  // Service de détection d'objets
```

### Frontend (React)
- Interface utilisateur permettant le téléchargement d'images
- Affichage des résultats de détection sous forme de liste et de visualisation
- Gestion du glisser-déposer et prévisualisation des images

### Service Python
- Service Flask pour la détection d'objets et la visualisation
- Utilise Ultralytics YOLO pour la détection d'objets
- Traitement d'images avec OpenCV et Pillow

## Points d'API

### Détection d'objets
- **Endpoint** : `/api/detect`
- **Méthode** : POST
- **Consomme** : multipart/form-data
- **Paramètre** : image (fichier)
- **Produit** : application/json
- **Réponse** : Liste des objets détectés avec leurs coordonnées et taux de confiance

### Visualisation des détections
- **Endpoint** : `/api/visualize`
- **Méthode** : POST
- **Consomme** : multipart/form-data
- **Paramètre** : image (fichier)
- **Produit** : image/jpeg
- **Réponse** : Image annotée avec les objets détectés

## Service de détection externe (Python)
- **Endpoint de détection** : `http://localhost:5000/detect`
- **Endpoint de visualisation** : `http://localhost:5000/visualize`
- **Format d'entrée** : JSON avec image encodée en Base64
- **Format de sortie pour la détection** : JSON avec liste d'objets
- **Format de sortie pour la visualisation** : Image JPEG avec annotations

## Installation et démarrage

### Prérequis
- Java 11 ou supérieur
- Maven
- Python 3.x
- Node.js et npm
- Navigateur web moderne

### Installation du service Python (détection d'objets)
1. Installer les dépendances Python :
   ```bash
   pip install flask ultralytics pillow opencv-python flask-cors
   ```
2. Lancer le service de détection :
   ```bash
   python detection_service.py
   ```

### Installation et démarrage du backend (Spring Boot)
1. Construire et démarrer l'application Spring Boot :
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

### Installation et démarrage du frontend (React)
1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Lancer le serveur de développement (à partir du dossier frontend):
   ```bash
   npm run dev
   ```
3. Accéder à l'application via un navigateur web à l'adresse :
   ```
   http://localhost:5173/
   ```

## Ordre de démarrage recommandé
1. Service Python (`python detection_service.py`)
2. Backend Spring Boot (`mvn spring-boot:run`)
3. Frontend React dans le frontend (cd frontend) (`npm run dev`)
