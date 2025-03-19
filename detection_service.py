from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from ultralytics import YOLO
import base64
import io
from PIL import Image
import cv2
import numpy as np
import traceback

app = Flask(__name__)
CORS(app)

# Charger le modèle YOLO
print("Chargement du modèle YOLO...")
model = YOLO('yolov8l.pt')
print("Modèle chargé avec succès!")

# Paramètres communs
CONFIDENCE_THRESHOLD = 0.5
IOU_THRESHOLD = 0.45
USE_AUGMENT = True

def process_image(request_data):
    """Fonction utilitaire pour traiter l'image depuis la requête"""
    # Récupérer l'image encodée en base64
    image_data = request_data.get('image')
    if not image_data:
        raise ValueError('Aucune image fournie')

    # Décoder l'image
    image_bytes = base64.b64decode(image_data)

    # Convertir en image
    image = Image.open(io.BytesIO(image_bytes))

    # Convertir l'image PIL en format numpy pour OpenCV
    image_np = np.array(image)
    # Si l'image est en mode RGB, la convertir en BGR pour OpenCV
    if len(image_np.shape) == 3 and image_np.shape[2] == 3:
        image_np = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)

    return image, image_np

@app.route('/detect', methods=['POST'])
def detect_objects():
    try:
        print("Requête reçue pour la détection d'objets")

        # Traiter l'image
        _, image_np = process_image(request.json)

        # Faire la détection
        print("Exécution de la détection...")
        results = model(image_np, conf=CONFIDENCE_THRESHOLD, iou=IOU_THRESHOLD, augment=USE_AUGMENT)

        # Formater les résultats
        detected_objects = []
        for r in results:
            boxes = r.boxes
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                class_id = int(box.cls[0])
                class_name = model.names[class_id]

                detected_objects.append({
                    'name': class_name,
                    'coordinates': [x1, y1, x2, y2],
                    'confidence': confidence
                })

        print(f"Détection terminée: {len(detected_objects)} objets trouvés")
        return jsonify({'objects': detected_objects})

    except ValueError as e:
        print(f"Erreur de validation: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Erreur inattendue: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/visualize', methods=['POST'])
def visualize_detections():
    try:
        # Traiter l'image
        _, image_np = process_image(request.json)

        # Faire la détection
        results = model(image_np, conf=CONFIDENCE_THRESHOLD, iou=IOU_THRESHOLD, augment=USE_AUGMENT)

        # Utiliser la fonction de plot intégrée pour dessiner
        plotted_img = results[0].plot()

        # Convertir l'image OpenCV en bytes
        _, buffer = cv2.imencode('.jpg', plotted_img)
        io_buf = io.BytesIO(buffer)

        # Renvoyer l'image directement
        return Response(io_buf.getvalue(), mimetype='image/jpeg')

    except ValueError as e:
        print(f"Erreur de validation: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        print(f"Erreur lors de la visualisation: {str(e)}")
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print(f"Service de détection démarré sur http://localhost:5000")
    print(f"Seuil de confiance: {CONFIDENCE_THRESHOLD}")
    print("Prêt à recevoir des requêtes POST sur /detect et /visualize")
    app.run(host='0.0.0.0', port=5000, debug=True)