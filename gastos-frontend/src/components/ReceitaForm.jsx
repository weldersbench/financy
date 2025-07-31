// src/components/ReceitaForm.jsx
import React, { useState, useEffect } from 'react';

function ReceitaForm({ onReceitaAdded, receita, onReceitaUpdated, onCancelEdit }) {
    const initialFormState = {
        valor: '',
        dataRecebimento: '',
        descricao: '',
        fonte: '',
        categoria: '',
        notificacao: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [isEditing, setIsEditing] = useState(false);

    const API_URL = 'http://localhost:8080/api/receitas';

    // Efeito para preencher o formulário se uma receita for passada para edição
    useEffect(() => {
        if (receita) {
            setFormData({
                ...receita,
                // Formata a data para o formato datetime-local (YYYY-MM-DDTHH:MM)
                dataRecebimento: receita.dataRecebimento ? new Date(receita.dataRecebimento).toISOString().slice(0, 16) : ''
            });
            setIsEditing(true);
        } else {
            setFormData(initialFormState);
            setIsEditing(false);
        }
    }, [receita]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validação básica
        if (!formData.valor || !formData.dataRecebimento || !formData.fonte || !formData.categoria) {
            alert('Por favor, preencha Valor, Data de Recebimento, Fonte e Categoria.');
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
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Falha ao ${isEditing ? 'atualizar' : 'adicionar'} receita: ${response.status} - ${errorText}`);
            }

            alert(`Receita ${isEditing ? 'atualizada' : 'adicionada'} com sucesso!`);
            setFormData(initialFormState); // Limpa o formulário
            setIsEditing(false); // Sai do modo de edição

            if (isEditing && onReceitaUpdated) {
                onReceitaUpdated(); // Notifica o pai que uma receita foi atualizada
            } else if (onReceitaAdded) {
                onReceitaAdded(); // Notifica o pai que uma nova receita foi adicionada
            }
            if (onCancelEdit) { // Se estiver editando e cancelar, limpa o estado de edição no pai
                onCancelEdit();
            }

        } catch (error) {
            console.error(`Erro ao ${isEditing ? 'atualizar' : 'adicionar'} receita:`, error);
            alert(`Erro: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>{isEditing ? 'Editar Receita' : 'Adicionar Nova Receita'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="valor">Valor:</label>
                    <input
                        type="number"
                        id="valor"
                        name="valor"
                        value={formData.valor}
                        onChange={handleChange}
                        step="0.01"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="dataRecebimento">Data de Recebimento:</label>
                    <input
                        type="datetime-local"
                        id="dataRecebimento"
                        name="dataRecebimento"
                        value={formData.dataRecebimento}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="fonte">Fonte:</label>
                    <input
                        type="text"
                        id="fonte"
                        name="fonte"
                        value={formData.fonte}
                        onChange={handleChange}
                        placeholder="Ex: Salário, Freelance, Investimento"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="categoria">Categoria:</label>
                    <input
                        type="text"
                        id="categoria"
                        name="categoria"
                        value={formData.categoria}
                        onChange={handleChange}
                        placeholder="Ex: Salário, Renda Extra, Reembolso"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descricao">Descrição (Opcional):</label>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Detalhes sobre a receita"
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="notificacao">Notificação Original (Opcional):</label>
                    <textarea
                        id="notificacao"
                        name="notificacao"
                        value={formData.notificacao}
                        onChange={handleChange}
                        rows="2"
                        placeholder="Texto completo do SMS/notificação"
                    ></textarea>
                </div>
                <button type="submit">{isEditing ? 'Atualizar Receita' : 'Adicionar Receita'}</button>
                {isEditing && (
                    <button type="button" onClick={onCancelEdit}>Cancelar Edição</button>
                )}
            </form>
        </div>
    );
}

export default ReceitaForm;