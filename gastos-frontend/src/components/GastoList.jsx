// src/components/GastoList.jsx
import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import GastoEditForm from './GastoEditForm';

// Este componente não precisa mais de forwardRef e useImperativeHandle aqui,
// pois o refresh será gerenciado pelo pai (App.jsx) que passa os 'gastos' como prop.
// Mas vamos manter forwardRef por enquanto para não quebrar a ref do App.jsx,
// embora não seja estritamente necessário para esta versão.
const GastoList = forwardRef(({ gastos, onGastoUpdated }, ref) => { // <--- Recebe 'gastos' e 'onGastoUpdated' como props
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('dataHora');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingGasto, setEditingGasto] = useState(null); // Estado para o gasto em edição

  const API_URL = 'http://localhost:8080/api/gastos'; // Ainda precisa da URL para DELETE/PUT

  // Remova a função fetchGastos daqui, pois o App.jsx vai buscá-los
  // e remova os estados loading e error se eles não forem usados apenas aqui.
  // No entanto, para simplificar por enquanto, vamos manter alguns deles.

  // A função handleDeleteGasto precisa de um refresh
  const handleDeleteGasto = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este gasto?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Falha ao excluir gasto: ${response.status}`);
      }

      alert('Gasto excluído com sucesso!');
      // Não precisa de fetchGastos() aqui diretamente.
      // Em vez disso, o componente pai (App.jsx) será notificado para recarregar.
      if (onGastoUpdated) { // onGastoUpdated é a fetchGastos do App.jsx
        onGastoUpdated();
      }
      
    } catch (error) {
      console.error('Erro ao excluir gasto:', error);
      alert(`Erro ao excluir gasto: ${error.message}.`);
    }
  };

  const handleEditClick = (gasto) => {
    setEditingGasto(gasto);
  };

  // onGastoUpdated já está vindo do App.jsx
  const handleEditFormGastoUpdated = () => { // Renomeado para evitar conflito com prop
    setEditingGasto(null);
    if (onGastoUpdated) {
        onGastoUpdated(); // Chama a fetchGastos do App.jsx para recarregar
    }
  };

  const handleCancelEdit = () => {
    setEditingGasto(null);
  };

  // O useEffect para fetchGastos não é mais necessário aqui
  // useEffect(() => { fetchGastos(); }, []); // REMOVA ESTE useEffect

  // REMOVA useImperativeHandle, pois App.jsx não vai mais usar ref para refresh
  // useImperativeHandle(ref, () => ({
  //   refreshGastos: () => { fetchGastos(); }
  // }));


  // 1. Lógica de filtro
  const filteredGastos = gastos.filter(gasto => { // 'gastos' agora é uma prop
    const term = searchTerm.toLowerCase();
    return (
      (gasto.estabelecimento && gasto.estabelecimento.toLowerCase().includes(term)) ||
      (gasto.categoria && gasto.categoria.toLowerCase().includes(term)) ||
      (gasto.descricao && gasto.descricao.toLowerCase().includes(term)) ||
      (gasto.smsOriginal && gasto.smsOriginal.toLowerCase().includes(term))
    );
  });

  // 2. Lógica de ordenação
  const sortedGastos = [...filteredGastos].sort((a, b) => {
    let compareA;
    let compareB;

    switch (sortBy) {
      case 'valor':
        compareA = a.valor;
        compareB = b.valor;
        break;
      case 'estabelecimento':
        compareA = a.estabelecimento ? a.estabelecimento.toLowerCase() : '';
        compareB = b.estabelecimento ? b.estabelecimento.toLowerCase() : '';
        break;
      case 'categoria':
        compareA = a.categoria ? a.categoria.toLowerCase() : '';
        compareB = b.categoria ? b.categoria.toLowerCase() : '';
        break;
      case 'dataHora':
      default:
        compareA = new Date(a.dataHora);
        compareB = new Date(b.dataHora);
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

  // Remova os condicionais de loading e error, pois App.jsx os gerencia
  // if (loading) { return <div>Carregando gastos...</div>; }
  // if (error) { return <div>Erro ao carregar gastos: {error}...</div>; }

  return (
    <div>
      <h2>Lista de Gastos</h2>

      {/* Renderiza o formulário de edição se houver um gasto em edição */}
      {editingGasto && (
        <GastoEditForm
          gasto={editingGasto}
          onGastoUpdated={handleEditFormGastoUpdated} 
          onCancelEdit={handleCancelEdit}
        />
      )}

      {!editingGasto && (
        <>
          <div> {/* Div para o campo de busca */}
            <label htmlFor="search">Buscar Gasto:</label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Estabelecimento, Categoria, Descrição..."
              style={{ width: '100%', marginBottom: '15px' }}
            />
          </div>

          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <label htmlFor="sortBy">Ordenar por:</label>
              <select id="sortBy" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="dataHora">Data</option>
                <option value="valor">Valor</option>
                <option value="estabelecimento">Estabelecimento</option>
                <option value="categoria">Categoria</option>
              </select>
            </div>
            <div>
              <label htmlFor="sortOrder">Ordem:</label>
              <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} style={{ marginLeft: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}>
                <option value="desc">Decrescente</option>
                <option value="asc">Crescente</option>
              </select>
            </div>
          </div>

          {sortedGastos.length === 0 && searchTerm !== '' ? (
            <p>Nenhum gasto encontrado com o termo "{searchTerm}".</p>
          ) : sortedGastos.length === 0 && searchTerm === '' ? (
            <p>Nenhum gasto registrado no momento. Adicione um!</p>
          ) : (
            <ul>
              {sortedGastos.map(gasto => (
                <li key={gasto.id}>
                  <div>
                    {`${gasto.dataHora ? new Date(gasto.dataHora).toLocaleDateString('pt-BR') : 'Data Inválida'} - ${gasto.estabelecimento} - R$ ${gasto.valor ? gasto.valor.toFixed(2).replace('.', ',') : '0,00'} (${gasto.categoria})`}
                  </div>
                  <div>
                    <button onClick={() => handleEditClick(gasto)}>Editar</button>
                    <button onClick={() => handleDeleteGasto(gasto.id)}>Excluir</button>
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

export default GastoList;