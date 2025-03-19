import React, { useState, useRef, useEffect } from 'react';

function PhotoDetection() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [activeTab, setActiveTab] = useState('list');
    const [errorMessage, setErrorMessage] = useState('');
    const [visualResult, setVisualResult] = useState(null);

    const fileInputRef = useRef(null);
    const imagePreviewRef = useRef(null);
    const dropZoneRef = useRef(null);

    // Gérer la sélection du fichier
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setErrorMessage('');
        } else if (file) {
            setErrorMessage('Veuillez sélectionner une image valide.');
        }
    };

    // Gérer le glisser-déposer
    useEffect(() => {
        const dropZone = dropZoneRef.current;

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.add('drag-over');
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropZone.classList.remove('drag-over');

            if (e.dataTransfer.files.length) {
                const file = e.dataTransfer.files[0];
                if (file.type.startsWith('image/')) {
                    setSelectedFile(file);
                    const reader = new FileReader();
                    reader.onload = () => {
                        setPreview(reader.result);
                    };
                    reader.readAsDataURL(file);
                    setErrorMessage('');
                } else {
                    setErrorMessage('Veuillez déposer une image valide.');
                }
            }
        };

        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);

        return () => {
            dropZone.removeEventListener('dragover', handleDragOver);
            dropZone.removeEventListener('dragleave', handleDragLeave);
            dropZone.removeEventListener('drop', handleDrop);
        };
    }, []);

    // Détecter les objets
    const detectObjects = async () => {
        if (!selectedFile) {
            setErrorMessage('Aucune image sélectionnée.');
            return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            // Appel API pour la détection d'objets
            const response = await fetch('/api/detect', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            setResults(data);

            // Appel API pour la visualisation
            try {
                const visualizeFormData = new FormData();
                visualizeFormData.append('image', selectedFile);

                const visualizeResponse = await fetch('/api/visualize', {
                    method: 'POST',
                    body: visualizeFormData
                });

                if (visualizeResponse.ok) {
                    const imageBlob = await visualizeResponse.blob();
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setVisualResult(imageUrl);
                }
            } catch (error) {
                console.error('Erreur lors de la visualisation:', error);
            }

        } catch (error) {
            console.error('Erreur lors de la détection:', error);
            setErrorMessage(`Erreur: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculer les statistiques
    const getStats = () => {
        if (!results || !results.detectedObjects) return { total: 0, highConf: 0, avgConf: 0 };

        const objects = results.detectedObjects;
        const total = objects.length;
        const highConf = objects.filter(obj => obj.confidence >= 0.8).length;
        const avgConf = total > 0
            ? objects.reduce((sum, obj) => sum + obj.confidence, 0) / total * 100
            : 0;

        return { total, highConf, avgConf: avgConf.toFixed(1) };
    };

    const { total, highConf, avgConf } = getStats();

    return (
        <div className="photo-detection">
            <h2>Télécharger une image</h2>

            {errorMessage && (
                <div className="error-message">
                    {errorMessage}
                </div>
            )}

            <div className="upload-area" ref={dropZoneRef}>
                <label className="file-upload-label">
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        style={{ display: 'none' }}
                    />
                    <span className="btn">Choisir une image</span>
                </label>
                <p>ou glissez-déposez votre image ici</p>

                {preview && (
                    <img
                        src={preview}
                        alt="Aperçu de l'image"
                        ref={imagePreviewRef}
                        style={{ display: 'block', maxHeight: '400px', margin: '20px auto' }}
                    />
                )}

                <button
                    className="btn"
                    onClick={detectObjects}
                    disabled={!selectedFile || isLoading}
                >
                    Détecter les objets
                </button>
            </div>

            {isLoading && (
                <div className="loading" style={{ display: 'block' }}>
                    <div className="spinner"></div>
                    <p>Détection des objets en cours...</p>
                </div>
            )}

            {results && !isLoading && (
                <div className="results-container">
                    <h2>Résultats de la détection</h2>

                    <div className="result-tabs">
                        <div
                            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
                            onClick={() => setActiveTab('list')}
                        >
                            Liste des objets
                        </div>
                        <div
                            className={`tab ${activeTab === 'visual' ? 'active' : ''}`}
                            onClick={() => setActiveTab('visual')}
                        >
                            Visualisation
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'list' ? 'active' : ''}`}>
                        <div className="stats">
                            <div className="stats-item">
                                <div className="stats-value">{total}</div>
                                <div className="stats-label">Objets détectés</div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-value">{highConf}</div>
                                <div className="stats-label">Haute confiance (80%+)</div>
                            </div>
                            <div className="stats-item">
                                <div className="stats-value">{avgConf}%</div>
                                <div className="stats-label">Confiance moyenne</div>
                            </div>
                        </div>

                        <div className="object-list">
                            {results.detectedObjects && results.detectedObjects.length > 0 ? (
                                results.detectedObjects.map((obj, index) => {
                                    const confidence = obj.confidence * 100;
                                    let confidenceClass = 'low';

                                    if (confidence >= 80) {
                                        confidenceClass = 'high';
                                    } else if (confidence >= 50) {
                                        confidenceClass = 'medium';
                                    }

                                    return (
                                        <div className="object-card" key={index}>
                                            <div>
                                                <span className="object-name">{obj.name}</span>
                                                <span className={`confidence ${confidenceClass}`}>{confidence.toFixed(2)}%</span>
                                            </div>
                                            {obj.coordinates && (
                                                <div className="coordinates">
                                                    Position: (x: {Math.round(obj.coordinates[0])}, y: {Math.round(obj.coordinates[1])})
                                                    à (x: {Math.round(obj.coordinates[2])}, y: {Math.round(obj.coordinates[3])})
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p>Aucun objet détecté</p>
                            )}
                        </div>
                    </div>

                    <div className={`tab-content ${activeTab === 'visual' ? 'active' : ''}`}>
                        {visualResult ? (
                            <>
                                <img
                                    src={visualResult}
                                    alt="Résultat de la détection"
                                    style={{ maxWidth: '100%', maxHeight: '600px', display: 'block', margin: '0 auto' }}
                                />
                                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                    <a href={visualResult} download="detection_result.jpg" className="btn">
                                        Télécharger l'image
                                    </a>
                                </div>
                            </>
                        ) : (
                            <p>Visualisation non disponible</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PhotoDetection;