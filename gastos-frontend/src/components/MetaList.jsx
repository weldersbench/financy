// src/components/MetaList.jsx
import React, { useState, forwardRef, useImperativeHandle } from 'react';

const MetaList = forwardRef(({ metas, onMetaUpdated, onOpenDetail, }, ref) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('dataAlvo');
    const [sortOrder, setSortOrder] = useState('asc');

    const API_URL = 'http://localhost:8080/api/metas';


    const calculateProgress = (meta) => {
        if (meta.valorAlvo === 0 || meta.valorAlvo === '0.00' || meta.valorAtual === undefined) {
            return 0;
        }
        return (parseFloat(meta.valorAtual) / parseFloat(meta.valorAlvo)) * 100;
    };

    const filteredMetas = metas.filter(meta => {
        const term = searchTerm.toLowerCase();
        return (meta.nome && meta.nome.toLowerCase().includes(term)) || (meta.descricao && meta.descricao.toLowerCase().includes(term));
    });

    const sortedMetas = [...filteredMetas].sort((a, b) => {
        let compareA, compareB;
        switch (sortBy) {
            case 'valorAlvo':
            case 'valorAtual':
                compareA = parseFloat(a[sortBy]);
                compareB = parseFloat(b[sortBy]);
                break;
            case 'nome':
            case 'status':
                compareA = a[sortBy] ? a[sortBy].toLowerCase() : '';
                compareB = b[sortBy] ? b[sortBy].toLowerCase() : '';
                break;
            case 'dataAlvo':
            default:
                compareA = new Date(a.dataAlvo);
                compareB = new Date(b.dataAlvo);
                break;
        }
        if (compareA < compareB) return sortOrder === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

    return (
        <div>
            <h2>Lista de Metas Financeiras</h2>
            <div>
                <label htmlFor="searchMeta">Buscar Meta:</label>
                <input
                    type="text"
                    id="searchMeta"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Nome, Descrição..."
                    style={{ width: '100%', marginBottom: '15px' }}
                />
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <label htmlFor="sortByMeta">Ordenar por:</label>
                    <select id="sortByMeta" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="dataAlvo">Data Alvo</option>
                        <option value="valorAlvo">Valor Alvo</option>
                        <option value="valorAtual">Valor Atual</option>
                        <option value="nome">Nome</option>
                        <option value="status">Status</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="sortOrderMeta">Ordem:</label>
                    <select id="sortOrderMeta" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="desc">Decrescente</option>
                        <option value="asc">Crescente</option>
                    </select>
                </div>
            </div>

            {sortedMetas.length === 0 && searchTerm !== '' ? (
                <p>Nenhuma meta encontrada com o termo "{searchTerm}".</p>
            ) : sortedMetas.length === 0 && searchTerm === '' ? (
                <p>Nenhuma meta registrada no momento. Adicione uma!</p>
            ) : (
                <ul style={{ cursor: 'pointer' }}>
                    {sortedMetas.map(meta => {
                        const progress = calculateProgress(meta);
                        const progressText = `${progress.toFixed(2)}%`;
                        return (
                            <li key={meta.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', position: 'relative' }}>
                                {/* CONTEÚDO DO ITEM (CLICÁVEL) */}
                                <div onClick={() => onOpenDetail(meta)} style={{ flexGrow: 1, width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{meta.nome} ({meta.status})</div>
                                        <div style={{ fontSize: '0.9rem' }}>{progressText}</div>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', backgroundColor: '#e0e0e0', borderRadius: '4px', marginTop: '5px' }}>
                                        <div style={{ width: `${Math.min(progress, 100)}%`, height: '100%', backgroundColor: '#3498db', borderRadius: '4px' }}></div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '5px', fontSize: '0.9rem', color: '#555' }}>
                                        <span>Alvo: {formatCurrency(meta.valorAlvo)}</span>
                                        <span>Progresso: {formatCurrency(meta.valorAtual)}</span>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
});

export default MetaList;