import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Shield, Clock, Home as HomeIcon } from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Camera className="home-feature-icon" />,
            title: "Inventaire Photo",
            description: "Documentez facilement vos biens pièce par pièce"
        },
        {
            icon: <Shield className="home-feature-icon" />,
            title: "Protection Assurance",
            description: "Simplifiez vos démarches en cas de sinistre"
        },
        {
            icon: <Clock className="home-feature-icon" />,
            title: "Mise à Jour Continue",
            description: "Gardez votre inventaire toujours à jour"
        },
        {
            icon: <HomeIcon className="home-feature-icon" />,
            title: "Multi-Propriétés",
            description: "Gérez plusieurs propriétés en un seul endroit"
        }
    ];

    return (
        <div className="home-container">
            <div className="home-header">
                <h1 className="home-title">
                    Votre solution d'inventaire photo pour une protection optimale
                </h1>
                <p className="home-subtitle">
                    Créez, gérez et protégez votre patrimoine avec une documentation visuelle complète et sécurisée.
                </p>

                <button
                    className="home-cta-button"
                    onClick={() => navigate("/detection")}
                >
                    Detecter objet
                </button>
            </div>

            <div className="home-features">
                {features.map((feature, index) => (
                    <div key={index} className="home-feature-card">
                        {feature.icon}
                        <h3 className="home-feature-title">{feature.title}</h3>
                        <p>{feature.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;