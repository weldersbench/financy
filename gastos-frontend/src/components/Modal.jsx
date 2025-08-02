// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom'; // Importe o ReactDOM para renderizar o modal fora do DOM normal

const Modal = ({ children, onClose, title }) => {
    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-dialog" onClick={e => e.stopPropagation()}> {/* Para prevenir o fechamento ao clicar dentro */}
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );

    // Renderiza o modal fora do componente pai, no final do <body>, para garantir que ele fique sempre por cima
    return ReactDOM.createPortal(modalContent, document.getElementById('modal-root'));
};

export default Modal;