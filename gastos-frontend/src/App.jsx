// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import GastoList from './components/GastoList';
import GastoForm from './components/GastoForm';
import GastoReport from './components/GastoReport';
import ReceitaList from './components/ReceitaList';
import ReceitaForm from './components/ReceitaForm';
import FinancialSummary from './components/FinancialSummary'; // <--- Importe o novo componente

function App() {
  const [gastos, setGastos] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('gastos');

  const API_URL_GASTOS = 'http://localhost:8080/api/gastos';
  const API_URL_RECEITAS = 'http://localhost:8080/api/receitas';

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

  // Chama ambas as funções de busca na montagem inicial do App
  useEffect(() => {
    fetchGastos();
    fetchReceitas();
  }, []);

  // Funções de callback para recarregar dados após adição/atualização
  const handleGastoAdded = () => {
    fetchGastos();
  };

  const handleReceitaAdded = () => {
    fetchReceitas();
  };

  // Funções de callback para recarregar dados após edição/exclusão em GastoList/ReceitaList
  const handleDataUpdated = () => {
    fetchGastos();
    fetchReceitas(); // Recarrega ambos para o summary também ser atualizado
  };


  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Meu Organizador Financeiro</h1>
        <p>Carregando dados financeiros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h1>Meu Organizador Financeiro</h1>
        <p>Erro ao carregar dados: {error}. Verifique se o backend está rodando!</p>
      </div>
    );
  }

  return (
    <>
      <h1>Meu Organizador Financeiro</h1>

      {/* Navegação entre Gastos e Receitas */}
      <div className="tab-navigation">
        <button 
          onClick={() => setCurrentView('gastos')}
          className={currentView === 'gastos' ? 'active-tab' : ''}
        >
          Gastos
        </button>
        <button 
          onClick={() => setCurrentView('receitas')}
          className={currentView === 'receitas' ? 'active-tab' : ''}
        >
          Receitas
        </button>
      </div>

      {/* Container principal para o layout em blocos */}
      <div className="main-layout-container">

        {/* Novo Bloco: Resumo Financeiro (Sempre visível) */}
        <div className="content-block" style={{ flexBasis: '100%' }}> {/* Ocupa 100% da largura em sua linha */}
            <FinancialSummary gastos={gastos} receitas={receitas} />
        </div>

        {currentView === 'gastos' && (
          <>
            <div className="content-block">
              <GastoForm onGastoAdded={handleGastoAdded} />
            </div>

            <div className="content-block">
              <GastoReport gastos={gastos} />
            </div>

            <div className="content-block gasto-list-block">
              <GastoList gastos={gastos} onGastoUpdated={handleDataUpdated} /> {/* Use handleDataUpdated */}
            </div>
          </>
        )}

        {currentView === 'receitas' && (
          <>
            <div className="content-block">
              <ReceitaForm onReceitaAdded={handleReceitaAdded} />
            </div>
            <div className="content-block gasto-list-block">
              <ReceitaList receitas={receitas} onReceitaUpdated={handleDataUpdated} /> {/* Use handleDataUpdated */}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default App;