import React from 'react';
import './RoomObjectsPage.css';

function RoomObjectsPage({ roomName, objects, onAddObject, onDeleteObject }) {
    return (
        <div className="room-objects-page card">
            <h2 className="room-objects-title">{roomName}</h2>
            <p className="room-objects-subtitle">
                Liste des objets dans cette pièce :
            </p>

            <table className="room-objects-table">
                <thead>
                <tr>
                    <th>Objet</th>
                    <th>Estimation</th>
                    <th>Facture</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {objects.map((item) => (
                    <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.estimation}</td>
                        <td>{item.facture}</td>
                        <td>
                            {/* Bouton factice Modifier */}
                            <button className="edit-btn">Modifier</button>
                            {/* Bouton factice Ajouter facture */}
                            <button className="add-invoice-btn">Ajouter facture</button>
                            {/* Bouton fonctionnel Supprimer */}
                            <button
                                className="delete-btn"
                                onClick={() => onDeleteObject(item.id)}
                            >
                                Supprimer
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <button className="add-photo-btn" onClick={onAddObject}>
                Ajouter objet
            </button>
        </div>
    );
}

export default RoomObjectsPage;
