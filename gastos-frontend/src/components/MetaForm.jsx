// src/components/MetaForm.jsx
import React, { useState, useEffect } from 'react';

function MetaForm({ onMetaAdded, meta, onMetaUpdated, onCancelEdit }) {
    const initialFormState = {
        nome: '',
        valorAlvo: '',
        valorAtual: 0, // Inicia com 0 para novas metas
        dataAlvo: '',
        descricao: '',
        status: 'Em Andamento'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const API_URL = 'http://localhost:8080/api/metas';

    useEffect(() => {
        if (meta) {
            setFormData({
                ...meta,
                // Formata a data para o formato esperado pelo input
                dataAlvo: meta.dataAlvo || '',
                dataCriacao: meta.dataCriacao || '',
            });
            setIsEditing(true);
        } else {
            setFormData(initialFormState);
            setIsEditing(false);
        }
    }, [meta]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.nome || !formData.valorAlvo || !formData.dataAlvo) {
            alert('Por favor, preencha Nome, Valor Alvo e Data Alvo.');
            return;
        }

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    valorAlvo: parseFloat(formData.valorAlvo), // Garante que é um número
                    valorAtual: parseFloat(formData.valorAtual),
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'adicionar'} meta: ${response.status} - ${errorText}`);
            }

            alert(`Meta ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`);
            setFormData(initialFormState);
            setIsEditing(false);

            if (isEditing && onMetaUpdated) {
                onMetaUpdated();
            } else if (onMetaAdded) {
                onMetaAdded();
            }
            if (onCancelEdit) {
                onCancelEdit();
            }

        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} meta:`, error);
            alert(`Erro: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Editar Meta Financeira' : 'Adicionar Nova Meta'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nome">Nome da Meta:</label>
                    <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="valorAlvo">Valor Alvo (R$):</label>
                    <input type="number" id="valorAlvo" name="valorAlvo" value={formData.valorAlvo} onChange={handleChange} step="0.01" required />
                </div>
                <div>
                    <label htmlFor="valorAtual">Valor Atual (R$):</label>
                    <input type="number" id="valorAtual" name="valorAtual" value={formData.valorAtual} onChange={handleChange} step="0.01" required />
                </div>
                <div>
                    <label htmlFor="dataAlvo">Data Alvo:</label>
                    <input type="date" id="dataAlvo" name="dataAlvo" value={formData.dataAlvo} onChange={handleChange} required />
                </div>
                <div>
                    <label htmlFor="status">Status:</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange}>
                        <option value="Em Andamento">Em Andamento</option>
                        <option value="Concluída">Concluída</option>
                        <option value="Pausada">Pausada</option>
                        <option value="Cancelada">Cancelada</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="descricao">Descrição (Opcional):</label>
                    <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} rows="2"></textarea>
                </div>
                <button type="submit">{isEditing ? 'Atualizar Meta' : 'Adicionar Meta'}</button>
                {isEditing && (
                    <button type="button" onClick={onCancelEdit}>Cancelar Edição</button>
                )}
            </form>
        </div>
    );
}

export default MetaForm;