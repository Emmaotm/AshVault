import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Clock, Home as HomeIcon } from 'lucide-react';
import './Home.css';
import reactLogo from '../../assets/add_image.png';
import RoomObjectsPage from '../liste_objets/RoomObjectsPage.jsx';

function Home() {
    const navigate = useNavigate();
    const [lastImage, setLastImage] = useState(reactLogo);
    const [hasDetection, setHasDetection] = useState(false);
    const selectedRoom = 'Salon';

    const [objectsInRoom, setObjectsInRoom] = useState([
        { id: 1, name: 'Canapé', estimation: '1200€', facture: 'Ajoutée' },
        { id: 2, name: 'Table basse', estimation: '200€', facture: 'Aucune' },
        { id: 3, name: 'Lampe', estimation: '25€', facture: 'Aucune' },
    ]);
    const [showRoomObjects, setShowRoomObjects] = useState(false);

    const handleToggleObjects = () => {
        setShowRoomObjects((prevState) => !prevState);
    };

    const handleAddObject = () => {
        const newObject = {
            id: Date.now(),
            name: 'Nouvel objet',
            estimation: '0€',
            facture: 'Aucune',
        };
        setObjectsInRoom((prev) => [...prev, newObject]);
    };

    const handleDeleteObject = (objectId) => {
        setObjectsInRoom((prev) => prev.filter((obj) => obj.id !== objectId));
    };
    // Récupérer l'image originale de la session au chargement du composant
    useEffect(() => {
        const savedImage = localStorage.getItem('lastUploadedImage');
        if (savedImage) {
            setLastImage(savedImage);
        }

        // Vérifier si des détections ont été réalisées sur cette image
        const detectionResults = localStorage.getItem('lastDetectionResults');
        if (detectionResults) {
            setHasDetection(true);
        }
    }, []);


    return (
        <div className="app-container">
            {/* Barre de navigation */}
            <header className="app-header">
                <div className="header-left">
                    <div className="header-logo">AshVault</div>
                </div>
                <div className="header-right">
                    <nav className="header-nav">
                        <a href="#accueil">Accueil</a>
                        <a href="#photos">Photos</a>
                        <a href="#profil">Profil</a>
                    </nav>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="main-content">
                {/* Titre principal + sous-texte */}
                <section className="page-intro">
                    <h1>Votre coffre-fort sécurisé</h1>
                    <p>Gérez les photos de vos propriétés et leurs contenus</p>
                </section>

                <div className="content-wrapper">
                    {/* Colonne de gauche : Propriétés + Ajouter une photo */}
                    <aside className="left-column">
                        {/* Bloc Propriétés */}
                        <div className="card properties-card">
                            <h2>Propriété</h2>
                            <div className="property-item">
                                <div className="property-address">123 Rue de Paris, 75001 Paris</div>
                                <ul className="property-rooms">
                                    <li>
                                        <a href="#salon" className="room-link">
                                            <span className="room-name">Salon</span>
                                            <span className="room-count">0 photo</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Bloc Ajouter une photo */}
                        <div className="card add-photo-card">
                            <h2>Ajouter une photo</h2>
                            <p>
                                Ajoutez une nouvelle photo à votre pièce
                            </p>
                            <button
                                className="add-photo-btn"
                                onClick={() => navigate("/detection")}>
                                Ajouter une photo
                            </button>
                        </div>
                        <div className="card add-photo-card">
                            <h2>Consulter la liste d'objets</h2>
                            <p>
                                Consultez, supprimez et ajoutez des objets à votre pièce
                            </p>
                            <button className="add-photo-btn" onClick={handleToggleObjects}>
                                Consulter les objets
                            </button>
                        </div>
                    </aside>

                    <section className="right-column card">
                        {showRoomObjects ? (
                            <RoomObjectsPage
                                roomName={selectedRoom}
                                objects={objectsInRoom}
                                onAddObject={handleAddObject}
                                onDeleteObject={handleDeleteObject}
                            />
                        ) : (
                            <>
                                <div className="room-info">
                                    <h2>Salon</h2>
                                    <p className="room-address">123 Rue de Paris, 75001 Paris</p>
                                </div>
                                <div className="photos-container">
                                    <div className="photo-item">
                                        <img src={lastImage} alt="Photo du salon"/>
                                    </div>
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Home;