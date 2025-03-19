import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Clock, Home as HomeIcon } from 'lucide-react';
import './Home.css';
import reactLogo from '../../assets/add_image.png';

function Home() {
    const navigate = useNavigate();
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
                                Ajoutez une nouvelle photo depuis votre téléphone ou votre ordinateur
                            </p>
                            <button
                                className="add-photo-btn"
                                onClick={()=> navigate("/detection")}>
                                Ajouter une photo</button>
                        </div>
                    </aside>

                    {/* Colonne de droite : Détails de la pièce sélectionnée + photos */}
                    <section className="right-column card">
                        <div className="room-info">
                            <h2>Salon</h2>
                            <p className="room-address">123 Rue de Paris, 75001 Paris</p>
                        </div>

                        <div className="photos-container">
                            <div className="photo-item">
                                <img src={reactLogo} alt="Exemple 1" />
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}


export default Home;