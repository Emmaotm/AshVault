import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PhotoDetection from "./PhotoDetection.jsx";
import './Detection.css';

const Detection = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate('/'); // Navigue vers la page d'accueil
    };

    return (
        <div>
            <div className="app">
                <header className="header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button
                        onClick={handleGoBack}
                        className="back-button"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        <ArrowLeft style={{marginRight: '8px'}}/>
                        Retour
                    </button>

                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <h1>Inventaire Photo pour Assurance</h1>
                        <p>Documentez votre intérieur pour faciliter les démarches d'indemnisation</p>
                    </div>
                </header>

                <main className="container">
                    <PhotoDetection/>
                </main>

                <footer className="footer">
                    <div className="container">
                        <p>&copy; 2025 Application d'Inventaire Photo</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Detection;