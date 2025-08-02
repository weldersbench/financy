// src/components/MetaDetail.jsx
import React from 'react';

function MetaDetail({ meta, onBackToList, onOpenEdit, onDeleteMeta }) {
    // Lógica de cálculo do andamento
    const valorAtual = parseFloat(meta.valorAtual);
    const valorAlvo = parseFloat(meta.valorAlvo);
    const dataAlvo = new Date(meta.dataAlvo);
    const dataCriacao = new Date(meta.dataCriacao);
    const hoje = new Date();

    const diasTotais = (dataAlvo - dataCriacao) / (1000 * 60 * 60 * 24);
    const diasPassados = (hoje - dataCriacao) / (1000 * 60 * 60 * 24);

    const progressoPercentual = (valorAtual / valorAlvo) * 100;
    const progressoEsperado = (diasPassados / diasTotais) * valorAlvo;

    const isAhead = valorAtual >= progressoEsperado;

    // Funções auxiliares para formatação
    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    const formatDate = (date) => new Intl.DateTimeFormat('pt-BR').format(date);

    // Estilos simples para a barra de progresso
    const progressBarBackground = '#e0e0e0';
    const progressBarFill = isAhead ? '#27ae60' : '#f39c12';

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2>Detalhes da Meta: {meta.nome}</h2>
                <div>
                    <button onClick={() => onOpenEdit(meta)} style={{ marginRight: '5px' }}>Editar</button>
                    <button onClick={() => onDeleteMeta(meta.id)}>Excluir</button>
                </div>
            </div>

            <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
                <p><strong>Descrição:</strong> {meta.descricao}</p>
                <p><strong>Valor Alvo:</strong> {formatCurrency(meta.valorAlvo)}</p>
                <p><strong>Valor Atual:</strong> {formatCurrency(meta.valorAtual)}</p>
                <p><strong>Data Alvo:</strong> {formatDate(dataAlvo)}</p>
                <p><strong>Status:</strong> {meta.status}</p>

                <h3 style={{ marginTop: '20px' }}>Progresso:</h3>

                <div style={{ width: '100%', height: '20px', backgroundColor: progressBarBackground, borderRadius: '10px' }}>
                    <div style={{ width: `${Math.min(progressoPercentual, 100)}%`, height: '100%', backgroundColor: progressBarFill, borderRadius: '10px' }}></div>
                </div>
                <p style={{ textAlign: 'center', marginTop: '10px', fontWeight: 'bold' }}>
                    {progressoPercentual.toFixed(2)}%
                </p>

                <h3 style={{ marginTop: '20px' }}>Análise de Andamento:</h3>
                {isAhead ? (
                    <p style={{ color: '#27ae60', fontWeight: 'bold' }}>
                        Você está no caminho certo!
                    </p>
                ) : (
                    <p style={{ color: '#e74c3c', fontWeight: 'bold' }}>
                        Você precisa aumentar seus aportes.
                        <br />
                        Progresso esperado: {formatCurrency(progressoEsperado.toFixed(2))}. Você está {formatCurrency(progressoEsperado - valorAtual)} abaixo do esperado.
                    </p>
                )}
            </div>
        </div>
    );
}

export default MetaDetail;