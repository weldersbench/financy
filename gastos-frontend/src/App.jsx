// src/App.jsx
import React, { useState, useEffect, useRef } from 'react'; // < -- React Hooks
import './App.css';
import GastoList from './components/GastoList';
import GastoForm from './components/GastoForm';
import GastoReport from './components/GastoReport';
import ReceitaList from './components/ReceitaList';
import ReceitaForm from './components/ReceitaForm';
import FinancialSummary from './components/FinancialSummary';
import MetaList from './components/MetaList';
import MetaForm from './components/MetaForm';
import MetaDetail from './components/MetaDetail';
import Modal from './components/Modal';

function App() {
  const [gastos, setGastos] = useState([]); // < -- setGastos armazena na variavel gastos que é o estado atual
  const [receitas, setReceitas] = useState([]);
  const [metas, setMetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('gastos');
  const [activeModalMeta, setActiveModalMeta] = useState(null); // <-- Meta do modal
  const [modalType, setModalType] = useState(null); // <-- Tipo de modal ('detail', 'edit', 'add')

  const API_URL_GASTOS = 'http://localhost:8080/api/gastos';
  const API_URL_RECEITAS = 'http://localhost:8080/api/receitas';
  const API_URL_METAS = 'http://localhost:8080/api/metas';

  const fetchGastos = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(API_URL_GASTOS);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGastos(data);
    } catch (err) {
        console.error("Erro ao buscar gastos:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
  const fetchReceitas = async () => {
    setLoading(true);
    setError(null);
    try {
        const response = await fetch(API_URL_RECEITAS);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setReceitas(data);
    } catch (err) {
        console.error("Erro ao buscar receitas:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
  const fetchMetas = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL_METAS);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setMetas(data);
    } catch (err) {
      console.error("Erro ao buscar metas:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteMeta = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta meta?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL_METAS}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error(`Falha ao excluir meta: ${response.status}`);
        }
        alert('Meta excluída com sucesso!');
        handleDataUpdated();
    } catch (error) {
        console.error('Erro ao excluir meta:', error);
        alert(`Erro ao excluir meta: ${error.message}.`);
    }
};

  useEffect(() => {
    fetchGastos();
    fetchReceitas();
    fetchMetas();
  }, []);

  const handleDataUpdated = () => {
    fetchGastos();
    fetchReceitas();
    fetchMetas();
  };

  const handleOpenDetailModal = (meta) => {
      setActiveModalMeta(meta);
      setModalType('detail');
  };

  const handleOpenEditModal = (meta) => {
      setActiveModalMeta(meta);
      setModalType('edit');
  };

  const handleCloseModal = () => {
      setActiveModalMeta(null);
      setModalType(null);
      handleDataUpdated(); // Recarrega os dados para garantir que a lista seja atualizada
  };

  const handleOpenAddMetaModal = () => { // <--- NOVO: Abrir modal para adicionar meta
      setActiveModalMeta(null); // Garante que a meta no modal seja nula
      setModalType('add');
  };

  if (loading) { /* ... */ }
  if (error) { /* ... */ }

  return (
    <>
      <h1>Meu Organizador Financeiro</h1>

      <div className="tab-navigation">
        <button onClick={() => setCurrentView('gastos')} className={currentView === 'gastos' ? 'active-tab' : ''}>Gastos</button>
        <button onClick={() => setCurrentView('receitas')} className={currentView === 'receitas' ? 'active-tab' : ''}>Receitas</button>
        <button onClick={() => setCurrentView('metas')} className={currentView === 'metas' ? 'active-tab' : ''}>Metas</button>
      </div>

      <div className="main-layout-container">
        <div className="content-block" style={{ flexBasis: '100%' }}>
            <FinancialSummary gastos={gastos} receitas={receitas} />
        </div>

        {currentView === 'gastos' && (
          <>
            <div className="content-block"><GastoForm onGastoAdded={handleDataUpdated} /></div>
            <div className="content-block"><GastoReport gastos={gastos} /></div>
            <div className="content-block gasto-list-block"><GastoList gastos={gastos} onGastoUpdated={handleDataUpdated} /></div>
          </>
        )}

        {currentView === 'receitas' && (
          <>
            <div className="content-block"><ReceitaForm onReceitaAdded={handleDataUpdated} /></div>
            <div className="content-block gasto-list-block"><ReceitaList receitas={receitas} onReceitaUpdated={handleDataUpdated} /></div>
          </>
        )}

        {currentView === 'metas' && (
          <>
            <div className="content-block" style={{ flexBasis: '100%' }}>
                {/* Botão de Adicionar Meta */}
                <button onClick={handleOpenAddMetaModal}>+ Adicionar Nova Meta</button>
            </div>
            <div className="content-block gasto-list-block">
                <MetaList metas={metas} onOpenDetail={handleOpenDetailModal} onOpenEdit={handleOpenEditModal} onMetaUpdated={handleDataUpdated} />
            </div>
          </>
        )}
      </div>

      {activeModalMeta && modalType === 'detail' && (
        <Modal onClose={handleCloseModal} title={`Detalhes da Meta: ${activeModalMeta.nome}`}>
            <MetaDetail 
                meta={activeModalMeta} 
                onBackToList={handleCloseModal} 
                onOpenEdit={handleOpenEditModal} 
                onDeleteMeta={handleDeleteMeta} 
            />
        </Modal>
      )}
      {modalType === 'edit' && (
          <Modal onClose={handleCloseModal} title="Editar Meta">
              <MetaForm meta={activeModalMeta} onMetaUpdated={handleCloseModal} onCancelEdit={handleCloseModal} />
          </Modal>
      )}
      {modalType === 'add' && (
          <Modal onClose={handleCloseModal} title="Adicionar Nova Meta">
              <MetaForm onMetaAdded={handleCloseModal} onCancelEdit={handleCloseModal} />
          </Modal>
      )}
    </>
  );
}
const handleDeleteMeta = async (id) => { /* ... */ }; // Move a função de delete para fora do componente

export default App;