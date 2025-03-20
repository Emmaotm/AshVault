// priceUtils.js
// Utilitaire pour estimer les prix des objets détectés

// Base de données de prix statique
const priceDatabase = {
    // Électronique
    "tv": { min: 300, max: 2000 },
    "laptop": { min: 500, max: 2500 },
    "computer": { min: 500, max: 2500 },
    "cell phone": { min: 200, max: 1200 },
    "smartphone": { min: 200, max: 1200 },
    "monitor": { min: 150, max: 800 },

    // Mobilier
    "sofa": { min: 400, max: 3000 },
    "couch": { min: 400, max: 1000 },
    "chair": { min: 50, max: 500 },
    "table": { min: 100, max: 1500 },
    "desk": { min: 150, max: 1000 },
    "bed": { min: 300, max: 2000 },
    "cabinet": { min: 200, max: 1200 },
    "bookshelf": { min: 100, max: 800 },

    // Électroménager
    "refrigerator": { min: 500, max: 2500 },
    "microwave": { min: 80, max: 500 },
    "oven": { min: 400, max: 2000 },
    "washing machine": { min: 350, max: 1500 },
    "dishwasher": { min: 300, max: 1200 },

    // Divers
    "bicycle": { min: 150, max: 2000 },
    "backpack": { min: 30, max: 200 },
    "suitcase": { min: 50, max: 400 },
    "book": { min: 10, max: 50 },
    "vase": { min: 20, max: 300 },
    "clock": { min: 20, max: 500 },
    "painting": { min: 100, max: 5000 },
    "mirror": { min: 50, max: 500 },
    "rug": { min: 100, max: 2000 },
    "carpet": { min: 100, max: 2000 },
    "potted plant": { min: 10, max: 100 },
    "cup": { min: 1, max: 20}


    // Note: La catégorie par défaut a été supprimée
};

/**
 * Estime le prix d'un objet basé sur sa catégorie
 * @param {string} objectName - Le nom de l'objet détecté
 * @returns {number} - Prix estimé
 */
export const estimatePrice = (objectName) => {
    // Normaliser le nom de l'objet (minuscules, sans espaces superflus)
    const normalizedName = objectName.toLowerCase().trim();

    // Chercher une correspondance exacte
    let priceRange = priceDatabase[normalizedName];

    // Si pas de correspondance exacte, chercher une correspondance partielle
    if (!priceRange) {
        for (const [key, value] of Object.entries(priceDatabase)) {
            if (normalizedName.includes(key) || key.includes(normalizedName)) {
                priceRange = value;
                break;
            }
        }
    }

    // Si toujours pas de correspondance, renvoyer 0
    if (!priceRange) {
        return 0;
    }

    // Générer un prix aléatoire dans la plage définie
    const randomFactor = Math.random();
    return priceRange.min + randomFactor * (priceRange.max - priceRange.min);
};

/**
 * Ajoute une estimation de prix à une liste d'objets détectés
 * @param {Array} detectedObjects - Liste des objets détectés
 * @returns {Array} - Liste des objets avec prix estimés
 */
export const addPriceEstimates = (detectedObjects) => {
    if (!detectedObjects || !Array.isArray(detectedObjects)) {
        return [];
    }

    return detectedObjects.map(obj => ({
        ...obj,
        estimatedPrice: estimatePrice(obj.name)
    }));
};

/**
 * Calcule le prix total des objets
 * @param {Array} objects - Liste des objets avec prix estimés
 * @returns {number} - Somme des prix estimés
 */
export const calculateTotalPrice = (objects) => {
    if (!objects || !Array.isArray(objects)) {
        return 0;
    }

    return objects.reduce((total, obj) => total + (obj.estimatedPrice || 0), 0);
};