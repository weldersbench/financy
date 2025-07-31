// src/components/GastoForm.jsx
import React, { useState } from 'react';

function GastoForm({ onGastoAdded }) { // onGastoAdded é uma função passada pelo componente pai
  const [valor, setValor] = useState('');
  const [dataHora, setDataHora] = useState(''); // Formato esperado: AAAA-MM-DDTHH:MM
  const [estabelecimento, setEstabelecimento] = useState('');
  const [categoria, setCategoria] = useState('Não Categorizado'); // Valor inicial
  const [descricao, setDescricao] = useState('');
  const [remetenteSms, setRemetenteSms] = useState(''); // Este será opcional ou para debug
  const [smsOriginal, setSmsOriginal] = useState('');   // Este será opcional ou para debug

  const API_URL = 'http://localhost:8080/api/gastos';

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página

    // Validação básica
    if (!valor || !dataHora || !estabelecimento) {
      alert('Por favor, preencha Valor, Data/Hora e Estabelecimento.');
      return;
    }

    // Criar o objeto de gasto para enviar ao backend
    const novoGasto = {
      valor: parseFloat(valor.replace(',', '.')), // Converte para número e garante ponto decimal
      dataHora: dataHora, // Enviando como string, o backend Jackson vai parsear
      estabelecimento: estabelecimento,
      categoria: categoria,
      descricao: descricao,
      remetenteSms: remetenteSms,
      smsOriginal: smsOriginal
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(novoGasto), // Converte o objeto JS para string JSON
      });

      if (!response.ok) {
        // Se a resposta não for OK (ex: 400 Bad Request, 500 Internal Server Error)
        const errorData = await response.json(); // Tenta ler o corpo da resposta de erro
        console.error('Erro ao adicionar gasto:', errorData);
        throw new Error(`Falha ao adicionar gasto: ${response.status} - ${errorData.message || response.statusText}`);
      }

      const addedGasto = await response.json(); // Pega o gasto adicionado (com ID) da resposta
      console.log('Gasto adicionado com sucesso:', addedGasto);
      alert('Gasto adicionado com sucesso!');

      // Limpar o formulário
      setValor('');
      setDataHora('');
      setEstabelecimento('');
      setCategoria('Não Categorizado');
      setDescricao('');
      setRemetenteSms('');
      setSmsOriginal('');

      // Notificar o componente pai para recarregar a lista de gastos
      if (onGastoAdded) {
        onGastoAdded();
      }

    } catch (error) {
      console.error('Erro na requisição:', error);
      alert(`Erro ao adicionar gasto: ${error.message}. Verifique o console.`);
    }
  };

  return (
    <div>
      <h2>Adicionar Novo Gasto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Valor (R$):</label>
          <input type="text" value={valor} onChange={(e) => setValor(e.target.value)} required />
        </div>
        <div>
          <label>Data/Hora:</label>
          <input type="datetime-local" value={dataHora} onChange={(e) => setDataHora(e.target.value)} required />
        </div>
        <div>
          <label>Estabelecimento:</label>
          <input type="text" value={estabelecimento} onChange={(e) => setEstabelecimento(e.target.value)} required />
        </div>
        <div>
          <label>Categoria:</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Não Categorizado">Não Categorizado</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Moradia">Moradia</option>
            <option value="Lazer">Lazer</option>
            <option value="Saúde">Saúde</option>
            <option value="Educação">Educação</option>
            <option value="Outros">Outros</option>
          </select>
        </div>
        <div>
          <label>Descrição (opcional):</label>
          <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
        </div>
        {/* Campos opcionais para debug/preenchimento manual avançado */}
        <div>
          <label>Remetente SMS (opcional):</label>
          <input type="text" value={remetenteSms} onChange={(e) => setRemetenteSms(e.target.value)} />
        </div>
        <div>
          <label>SMS Original (opcional):</label>
          <textarea value={smsOriginal} onChange={(e) => setSmsOriginal(e.target.value)} rows="3"></textarea>
        </div>
        <button type="submit">Adicionar Gasto</button>
      </form>
    </div>
  );
}

export default GastoForm;