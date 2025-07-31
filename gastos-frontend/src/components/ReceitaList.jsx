// src/components/ReceitaList.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ReceitaForm from './ReceitaForm'; // Importa o formulário para edição

const ReceitaList = forwardRef(({ receitas, onReceitaUpdated }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dataRecebimento');
    const [sortOrder, setSortOrder] = useState('desc');
    const [editingReceita, setEditingReceita] = useState(null); // Estado para a receita em edição

    const API_URL = 'http://localhost:8080/api/receitas';

    const handleDeleteReceita = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta receita?')) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`Falha ao excluir receita: ${response.status}`);
            }

            alert('Receita excluída com sucesso!');
            if (onReceitaUpdated) {
                onReceitaUpdated(); // Notifica o pai (App.jsx) para recarregar as receitas
            }

        } catch (error) {
            console.error('Erro ao excluir receita:', error);
            alert(`Erro ao excluir receita: ${error.message}.`);
        }
    };

    const handleEditClick = (receita) => {
        setEditingReceita(receita);
    };

    const handleEditFormReceitaUpdated = () => {
        setEditingReceita(null); // Sai do modo de edição
        if (onReceitaUpdated) {
            onReceitaUpdated(); // Notifica o pai para recarregar as receitas
        }
    };

    const handleCancelEdit = () => {
        setEditingReceita(null);
    };

    // 1. Lógica de filtro
    const filteredReceitas = receitas.filter(receita => {
        const term = searchTerm.toLowerCase();
        return (
            (receita.fonte && receita.fonte.toLowerCase().includes(term)) ||
            (receita.categoria && receita.categoria.toLowerCase().includes(term)) ||
            (receita.descricao && receita.descricao.toLowerCase().includes(term)) ||
            (receita.notificacao && receita.notificacao.toLowerCase().includes(term))
        );
    });

    // 2. Lógica de ordenação
    const sortedReceitas = [...filteredReceitas].sort((a, b) => {
        let compareA;
        let compareB;

        switch (sortBy) {
            case 'valor':
                compareA = a.valor;
                compareB = b.valor;
                break;
            case 'fonte':
                compareA = a.fonte ? a.fonte.toLowerCase() : '';
                compareB = b.fonte ? b.fonte.toLowerCase() : '';
                break;
            case 'categoria':
                compareA = a.categoria ? a.categoria.toLowerCase() : '';
                compareB = b.categoria ? b.categoria.toLowerCase() : '';
                break;
            case 'dataRecebimento':
            default:
                compareA = new Date(a.dataRecebimento);
                compareB = new Date(b.dataRecebimento);
                break;
        }

        if (compareA < compareB) {
            return sortOrder === 'asc' ? -1 : 1;
        }
        if (compareA > compareB) {
            return sortOrder === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return (
        <div>
            <h2>Lista de Receitas</h2>

            {/* Renderiza o formulário de edição se houver uma receita em edição */}
            {editingReceita && (
                <ReceitaForm
                    receita={editingReceita}
                    onReceitaUpdated={handleEditFormReceitaUpdated}
                    onCancelEdit={handleCancelEdit}
                />
            )}

            {!editingReceita && (
                <>
                    <div>
                        <label htmlFor="searchReceita">Buscar Receita:</label>
                        <input
                            type="text"
                            id="searchReceita"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Fonte, Categoria, Descrição..."
                            style={{ width: '100%', marginBottom: '15px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <label htmlFor="sortByReceita">Ordenar por:</label>
                            <select id="sortByReceita" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                <option value="dataRecebimento">Data</option>
                                <option value="valor">Valor</option>
                                <option value="fonte">Fonte</option>
                                <option value="categoria">Categoria</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="sortOrderReceita">Ordem:</label>
                            <select id="sortOrderReceita" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                                <option value="desc">Decrescente</option>
                                <option value="asc">Crescente</option>
                                
                            </select>
                    </div>
                </div>

                {sortedReceitas.length === 0 && searchTerm !== '' ? (
                    <p>Nenhuma receita encontrada com o termo "{searchTerm}".</p>
                ) : sortedReceitas.length === 0 && searchTerm === '' ? (
                    <p>Nenhuma receita registrada no momento. Adicione uma!</p>
                ) : (
                    <ul>
                        {sortedReceitas.map(receita => (
                            <li key={receita.id}>
                                <div>
                                    {`${receita.dataRecebimento ? new Date(receita.dataRecebimento).toLocaleDateString('pt-BR') : 'Data Inválida'} - ${receita.fonte} - R$ ${receita.valor ? parseFloat(receita.valor).toFixed(2).replace('.', ',') : '0,00'} (${receita.categoria})`}
                                </div>
                                <div>
                                    <button onClick={() => handleEditClick(receita)}>Editar</button>
                                    <button onClick={() => handleDeleteReceita(receita.id)}>Excluir</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </>
        )}
    </div>
    );
});

export default ReceitaList;
